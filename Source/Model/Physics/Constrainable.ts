
namespace ThisCouldBeBetter.GameFramework
{

export class Constrainable implements EntityProperty
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

	constrain
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
		var constrainable = entity.constrainable();
		var constraints = constrainable.constraints;
		for (var i = 0; i < constraints.length; i++)
		{
			var constraint = constraints[i];
			constraint.constrain(universe, world, place, entity);
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

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}

	initialize
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
		this.updateForTimerTick(universe, world, place, entity);
	}

	updateForTimerTick
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
		this.constrain(universe, world, place, entity);
	}
}

}
