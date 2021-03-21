
namespace ThisCouldBeBetter.GameFramework
{

export class Constrainable extends EntityProperty
{
	constraints: Constraint[];

	private _constraintsByClassName: Map<string,Constraint>;

	constructor(constraints: Constraint[])
	{
		super();
		this.constraints = constraints;
		this._constraintsByClassName =
			ArrayHelper.addLookups(this.constraints, x => x.constructor.name);
	}

	static constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var constrainable = entity.constrainable();
		var constraints = constrainable.constraints;
		for (var i = 0; i < constraints.length; i++)
		{
			var constraint = constraints[i];
			constraint.constrain(universe, world, place, entity);
		}
	}

	constraintByClassName(constraintClassName: string)
	{
		return this._constraintsByClassName.get(constraintClassName);
	}

	initialize(universe: Universe, world: World, place: Place, entity: Entity)
	{
		this.updateForTimerTick(universe, world, place, entity);
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		Constrainable.constrain(universe, world, place, entity);
	}
}

}
