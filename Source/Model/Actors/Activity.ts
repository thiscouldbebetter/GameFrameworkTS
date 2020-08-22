
class Activity
{
	defnName: string;
	target: any;

	constructor(defnName: string, target: any)
	{
		this.defnName = defnName;
		this.target = target;
	}

	defn(world: World)
	{
		return world.defn.activityDefnsByName().get(this.defnName);
	}

	perform(u: Universe, w: World, p: Place, e: Entity)
	{
		this.defn(w).perform(u, w, p, e, this);
	}
}
