
function Constrainable(constraints)
{
	this.constraints = constraints;
}
{
	Constrainable.constrain = function(universe, world, place, constrainable)
	{
		var constraints = constrainable.constraints;
		for (var i = 0; i < constraints.length; i++)
		{
			var constraint = constraints[i];
			constraint.constrain(universe, world, place, constrainable, constrainable);
		}
	}

	Constrainable.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		Constrainable.constrain(universe, world, place, entity);
	}
}
