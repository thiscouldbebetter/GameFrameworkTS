
function Constrainable(constraints)
{
	this.constraints = constraints;
}
{
	Constrainable.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		for (var i = 0; i < this.constraints.length; i++)
		{
			var constraint = this.constraints[i];
			constraint.constrain(universe, world, place, entity, constraint.target);
		}
	}
}
