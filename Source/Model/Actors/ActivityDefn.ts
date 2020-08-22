
class ActivityDefn
{
	name: string;
	_perform: (u: Universe, w: World, p: Place, e: Entity, a: Activity) => void;

	constructor
	(
		name: string,
		perform: (u: Universe, w: World, p: Place, e: Entity, a: Activity) => void
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

	perform(u: Universe, w: World, p: Place, e: Entity, a: Activity)
	{
		this._perform(u, w, p, e, a);
	}
}

class ActivityDefn_Instances
{
	_All: ActivityDefn[];
	_AllByName: Map<string, ActivityDefn>;

	DoNothing: ActivityDefn;

	constructor()
	{
		this.DoNothing = new ActivityDefn
		(
			"DoNothing",
			(u: Universe, w: World, p: Place, e: Entity, a: Activity) => {}// perform
		);
		
		this._All =
		[
			this.DoNothing
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}
