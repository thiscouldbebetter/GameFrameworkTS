
class Activity
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

	defn(world: World)
	{
		return world.defn.activityDefnsByName().get(this.defnName);
	}

	defnNameAndTargetSet(defnName: string, target: any)
	{
		this.defnName = defnName;
		this.target = target;
		return this;
	}

	perform(u: Universe, w: World, p: Place, e: Entity)
	{
		if (this.defnName != null)
		{
			this.defn(w).perform(u, w, p, e, this);
		}
	}
}
