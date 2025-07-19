
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

	static default(): Actor
	{
		return Actor.fromActivityDefn
		(
			ActivityDefn.Instances().DoNothing
		);
	}

	static fromActivity(activity: Activity): Actor
	{
		return new Actor(activity);
	}

	static fromActivityDefn(activityDefn: ActivityDefn): Actor
	{
		return Actor.fromActivityDefnName(activityDefn.name);
	}

	static fromActivityDefnName(activityDefnName: string): Actor
	{
		var activity = Activity.fromDefnName(activityDefnName);
		var returnValue = new Actor(activity);
		return returnValue;
	}

	static of(entity: Entity): Actor
	{
		return entity.propertyByName(Actor.name) as Actor;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	propertyName(): string { return Actor.name; }

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
