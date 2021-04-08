
namespace ThisCouldBeBetter.GameFramework
{

export class Activity
{
	defnName: string;
	target: any;
	isDone: boolean;

	constructor(defnName: string, target: any)
	{
		this.defnName = defnName;
		this.target = target;

		this.isDone = false;
	}

	static fromDefnName(defnName: string): Activity
	{
		return new Activity(defnName, null);
	}

	defn(world: World): ActivityDefn
	{
		return world.defn.activityDefnByName(this.defnName);
	}

	defnNameAndTargetSet(defnName: string, target: any): Activity
	{
		this.defnName = defnName;
		this.target = target;
		return this;
	}

	perform(u: Universe, w: World, p: Place, e: Entity): void
	{
		if (this.defnName != null)
		{
			var defn = this.defn(w);
			defn.perform(u, w, p, e);
		}
	}
}

}
