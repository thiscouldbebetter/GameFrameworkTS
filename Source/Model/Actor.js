
function Actor(activity)
{
	this.activity = activity;
}
{
	Actor.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		this.activity(universe, world, place, entity);
	}
}