
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

	static fromActivityDefnName(activityDefnName: string): Actor
	{
		var activity = Activity.fromDefnName(activityDefnName);
		var returnValue = new Actor(activity);
		return returnValue;
	}

	updateForTimerTick
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
		this.activity.perform(universe, world, place, entity);
	}
}

}
