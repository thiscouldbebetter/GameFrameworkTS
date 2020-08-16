
class Actor extends EntityProperty
{
	activity: any;
	target: any;

	actions: Action[];

	constructor(activity: any, target: any)
	{
		super();
		this.activity = activity;
		this.target = target;
		this.actions = [];
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		this.activity(universe, world, place, entity, this.target);
	}
}
