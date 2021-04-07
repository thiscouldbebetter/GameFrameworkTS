
namespace ThisCouldBeBetter.GameFramework
{

export class ActivityDefn
{
	name: string;
	_perform: (u: Universe, w: World, p: Place, e: Entity) => void;

	constructor
	(
		name: string,
		perform: (u: Universe, w: World, p: Place, e: Entity) => void
	)
	{
		this.name = name;
		this._perform = perform;
	}

	static _instances: ActivityDefn_Instances;
	static Instances()
	{
		if (ActivityDefn._instances == null)
		{
			ActivityDefn._instances = new ActivityDefn_Instances();
		}
		return ActivityDefn._instances;
	}

	perform(u: Universe, w: World, p: Place, e: Entity)
	{
		this._perform(u, w, p, e);
	}
}

class ActivityDefn_Instances
{
	_All: ActivityDefn[];
	_AllByName: Map<string, ActivityDefn>;

	DoNothing: ActivityDefn;
	Simultaneous: ActivityDefn;

	constructor()
	{
		this.DoNothing = new ActivityDefn
		(
			"DoNothing",
			// perform
			(u: Universe, w: World, p: Place, e: Entity) =>
			{}
		);

		this.Simultaneous = new ActivityDefn
		(
			"Simultaneous",
			// perform
			(u: Universe, w: World, p: Place, e: Entity) =>
			{
				var activity = e.actor().activity;
				var childActivities = activity.target as Activity[];
				childActivities = childActivities.filter(x => x.isDone == false);
				activity.target = childActivities;
				for (var i = 0; i < childActivities.length; i++)
				{
					var childActivity = childActivities[i];
					childActivity.perform(u, w, p, e);
				}
			}
		);

		this._All =
		[
			this.DoNothing,
			this.Simultaneous
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}

}
