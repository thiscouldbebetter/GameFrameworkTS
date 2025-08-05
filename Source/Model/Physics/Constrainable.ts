
namespace ThisCouldBeBetter.GameFramework
{

export class Constrainable extends EntityPropertyBase<Constrainable>
{
	constraints: Constraint[];

	private _constraintsByClassName: Map<string,Constraint>;

	constructor(constraints: Constraint[])
	{
		super();

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
		this._constraintsByClassName.clear();
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

	constraintRemove
	(
		constraintToRemove: Constraint
	): Constrainable
	{
		var constraintIndex =
			this.constraints.indexOf(constraintToRemove);
		this.constraints.splice(constraintIndex, 1);
		var constraintClassName =
			constraintToRemove.constructor.name;
		this._constraintsByClassName.delete(constraintClassName);
		return this;
	}

	constraintRemoveFinal(): Constrainable
	{
		var constraintToRemove =
			this.constraints[this.constraints.length - 1];
		return this.constraintRemove(constraintToRemove);
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.updateForTimerTick(uwpe);
	}

	propertyName(): string { return Constrainable.name; }

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
