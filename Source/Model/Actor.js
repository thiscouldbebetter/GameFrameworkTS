
class Actor
{
	constructor(activity, target)
	{
		this.activity = activity;
		this.target = target;
		this.actions = [];
	}

	updateForTimerTick(universe, world, place, entity)
	{
		this.activity(universe, world, place, entity, this.target);
	}
}
