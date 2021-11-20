
namespace ThisCouldBeBetter.GameFramework
{

export class Constrainable implements EntityProperty<Constrainable>
{
	constraints: Constraint[];

	private _constraintsByClassName: Map<string,Constraint>;

	constructor(constraints: Constraint[])
	{
		this.constraints = constraints || [];
		this._constraintsByClassName =
			ArrayHelper.addLookups(this.constraints, x => x.constructor.name);
	}

	static create(): Constrainable
	{
		return new Constrainable([]);
	}

	static fromConstraint(constraint: Constraint): Constrainable
	{
		return new Constrainable( [ constraint ] );
	}

	clear(): Constrainable
	{
		this.constraints.length = 0;
		return this;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;
		var constrainable = entity.constrainable();
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
		this._constraintsByClassName.set
		(
			constraintToAdd.constructor.name, constraintToAdd
		);
		return this;
	}

	constraintByClassName(constraintClassName: string): Constraint
	{
		return this._constraintsByClassName.get(constraintClassName);
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}

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

	// Equatable

	equals(other: Constrainable): boolean { return false; } // todo

}

}
