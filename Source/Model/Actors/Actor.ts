
namespace ThisCouldBeBetter.GameFramework
{

export class Actor extends EntityProperty
{
	activity: Activity;

	actions: Action[];

	constructor(activity: Activity)
	{
		super();
		this.activity = activity;
		this.actions = [];
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		this.activity.perform(universe, world, place, entity);
	}
}

}
