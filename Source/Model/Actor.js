
function Actor(activity, target)
{
	this.activity = activity;
	this.target = target;
}
{
	Actor.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		this.activity(universe, world, place, entity, this.target);
	}
}
