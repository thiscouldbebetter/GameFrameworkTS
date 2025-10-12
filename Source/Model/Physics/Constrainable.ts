
namespace ThisCouldBeBetter.GameFramework
{

export class Constrainable extends EntityPropertyBase<Constrainable>
{
	constraints: Constraint[];

	constructor(constraints: Constraint[])
	{
		super();

		this.constraints = constraints || [];
	}

	static create(): Constrainable
	{
		return new Constrainable([]);
	}

	static fromConstraint(constraint: Constraint): Constrainable
	{
		return new Constrainable( [ constraint ] );
	}

	static fromConstraints(constraints: Constraint[]): Constrainable
	{
		return new Constrainable(constraints);
	}

	static of(entity: Entity): Constrainable
	{
		return entity.propertyByName(Constrainable.name) as Constrainable;
	}

	clear(): Constrainable
	{
		this.constraints.length = 0;
		return this;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;
		var constrainable = Constrainable.of(entity);
		var constraints = constrainable.constraints;
		for (var i = 0; i < constraints.length; i++)
		{
			var constraint = constraints[i];
			constraint.constrain(uwpe);
		}
	}

	constraintAdd(constraintToAdd: Constraint): Constrainable
	{
		this.constraints.push(constraintToAdd);
		return this;
	}

	constraintByClassName(constraintClassName: string): Constraint
	{
		var constraint =
			this.constraints.find(x => x.constructor.name == constraintClassName);

		return constraint;
	}

	constraintByName(constraintName: string): Constraint
	{
		var constraint =
			this.constraints.find(x => x.name == constraintName);

		return constraint;
	}

	constraintRemove
	(
		constraintToRemove: Constraint
	): Constrainable
	{
		var constraintIndex =
			this.constraints.indexOf(constraintToRemove);
		this.constraints.splice(constraintIndex, 1);
		return this;
	}

	constraintRemoveByName(constraintToRemoveName: string): Constrainable
	{
		var constraintToRemove =
			this.constraints.find(x => x.name == constraintToRemoveName);

		return this.constraintRemove(constraintToRemove);
	}

	// EntityProperty.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.updateForTimerTick(uwpe);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		this.constrain(uwpe);
	}

	// Clonable.

	clone(): Constrainable
	{
		return new Constrainable(ArrayHelper.clone(this.constraints));
	}

	overwriteWith(other: Constrainable): Constrainable
	{
		ArrayHelper.overwriteWith(this.constraints, other.constraints);
		return this;
	}

}

}
