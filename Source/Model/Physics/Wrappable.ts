
namespace ThisCouldBeBetter.GameFramework
{

export class Wrappable extends EntityPropertyBase<Wrappable>
{
	sizeInWrappedInstances: Coords;
	constraintWrap: Constraint;

	initializationIsComplete: boolean;

	constructor(sizeInWrappedInstances: Coords, constraintWrap: Constraint)
	{
		super();

		this.sizeInWrappedInstances = sizeInWrappedInstances;
		this.constraintWrap = constraintWrap;

		this.initializationIsComplete = false;
	}

	static fromSizeInWrappedInstancesAndConstraintWrap
	(
		sizeInWrappedInstances: Coords, constraintWrap: Constraint
	): Wrappable
	{
		return new Wrappable(sizeInWrappedInstances, constraintWrap);
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.initializationIsComplete == false)
		{
			var place = uwpe.place;
			var entity = uwpe.entity;

			var collidable = Collidable.of(entity);
			if (collidable != null)
			{
				var colliderAtRest = collidable.colliderAtRest;
				var placeSizeToWrapTo = place.size();
				colliderAtRest = ShapeWrapped.fromSizeInWrappedInstancesSizeToWrapToAndChild
				(
					this.sizeInWrappedInstances,
					placeSizeToWrapTo,
					colliderAtRest
				);
				collidable.colliderAtRestSet(colliderAtRest);
			}

			var constrainable = Constrainable.of(entity);
			if (constrainable != null)
			{
				constrainable.constraintAdd(this.constraintWrap);
			}

			var drawable = Drawable.of(entity);
			if (drawable != null)
			{
				var visual = drawable.visual;
				visual = VisualWrapped.fromSizeInWrappedInstancesAndChild
				(
					this.sizeInWrappedInstances,
					visual
				);
				drawable.visualSet(visual);
			}

			this.initializationIsComplete = true;
		}
	}

	// Clonable.

	clone() : Wrappable
	{
		return new Wrappable(this.sizeInWrappedInstances, this.constraintWrap);
	}
}

}