
class Constrainable
{
	constructor(constraints)
	{
		this.constraints = constraints;
	}

	static constrain(universe, world, place, entity)
	{
		var constrainable = entity.constrainable;
		var constraints = constrainable.constraints;
		for (var i = 0; i < constraints.length; i++)
		{
			var constraint = constraints[i];
			constraint.constrain(universe, world, place, entity);
		}
	};

	initialize(universe, world, place, entity)
	{
		this.updateForTimerTick(universe, world, place, entity);
	};

	updateForTimerTick(universe, world, place, entity)
	{
		Constrainable.constrain(universe, world, place, entity);
	};
}
