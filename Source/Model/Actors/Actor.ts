
namespace ThisCouldBeBetter.GameFramework
{

export class Actor implements EntityProperty
{
	activity: Activity;

	actions: Action[];

	constructor(activity: Activity)
	{
		this.activity = activity;
		this.actions = [];
	}

	static fromActivityDefnName(activityDefnName: string): Actor
	{
		var activity = Activity.fromDefnName(activityDefnName);
		var returnValue = new Actor(activity);
		return returnValue;
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}

	updateForTimerTick
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
		this.activity.perform(universe, world, place, entity);
	}
}

}
