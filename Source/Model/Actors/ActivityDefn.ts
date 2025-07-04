
namespace ThisCouldBeBetter.GameFramework
{

export class ActivityDefn
{
	name: string;
	_perform: (uwpe: UniverseWorldPlaceEntities) => void;

	constructor
	(
		name: string,
		perform: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.name = name;
		this._perform = perform;
	}

	static fromNameAndPerform
	(
		name: string,
		perform: (uwpe: UniverseWorldPlaceEntities) => void
	): ActivityDefn
	{
		return new ActivityDefn(name, perform);
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

	perform(uwpe: UniverseWorldPlaceEntities)
	{
		this._perform(uwpe);
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
		this.DoNothing = ActivityDefn.fromNameAndPerform
		(
			"DoNothing",
			// perform
			(uwpe: UniverseWorldPlaceEntities) =>
			{}
		);

		this.Simultaneous = ActivityDefn.fromNameAndPerform
		(
			"Simultaneous",
			// perform
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var w = uwpe.world;
				var e = uwpe.entity;
				var activity = Actor.of(e).activity;
				var targetEntity = activity.targetEntity();
				var childDefnNames = NamableProperty.of(targetEntity).name.split(";");
				for (var i = 0; i < childDefnNames.length; i++)
				{
					var childDefnName = childDefnNames[i];
					var childDefn = w.defn.activityDefnByName(childDefnName);
					childDefn.perform(uwpe);
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
