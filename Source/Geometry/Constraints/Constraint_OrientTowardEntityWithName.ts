
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_OrientTowardEntityWithName implements Constraint
{
	targetEntityName: string;

	constructor(targetEntityName: string)
	{
		this.targetEntityName = targetEntityName;
	}

	static fromTargetEntityName
	(
		targetEntityName: string
	): Constraint_OrientTowardEntityWithName
	{
		return new Constraint_OrientTowardEntityWithName(targetEntityName);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;
		var entity = uwpe.entity;

		var targetEntityName = this.targetEntityName;

		var constrainableLoc = Locatable.of(entity).loc;
		var constrainablePos = constrainableLoc.pos;
		var constrainableOri = constrainableLoc.orientation;
		var constrainableForward = constrainableOri.forward;

		var target = place.entityByName(targetEntityName);
		if (target != null)
		{
			var targetPos = Locatable.of(target).loc.pos;

			constrainableForward
				.overwriteWith(targetPos)
				.subtract(constrainablePos)
				.normalize();

			constrainableOri.forwardSet(constrainableForward);
		}
	}

	// Clonable.

	clone(): Constraint
	{
		return this; // todo
	}

	overwriteWith(other: Constraint): Constraint
	{
		return this; // todo
	}
}

}
