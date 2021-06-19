
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

	static create(): Actor
	{
		return new Actor(null);
	}

	static fromActivityDefnName(activityDefnName: string): Actor
	{
		var activity = Activity.fromDefnName(activityDefnName);
		var returnValue = new Actor(activity);
		return returnValue;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		this.activity.perform(uwpe);
	}
}

}
