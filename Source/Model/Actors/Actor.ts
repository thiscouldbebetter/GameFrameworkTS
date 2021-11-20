
namespace ThisCouldBeBetter.GameFramework
{

export class Actor implements EntityProperty<Actor>
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
		return Actor.fromActivityDefnName
		(
			ActivityDefn.Instances().DoNothing.name
		);
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

	// Clonable.

	clone(): Actor
	{
		return new Actor(this.activity.clone());
	}

	overwriteWith(other: Actor): Actor
	{
		this.activity.overwriteWith(other.activity);
		return this;
	}

	// Equatable

	equals(other: Actor): boolean { return false; } // todo

}

}
