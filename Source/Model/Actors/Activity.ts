
namespace ThisCouldBeBetter.GameFramework
{

export class Activity
{
	defnName: string;
	targetsByName: Map<string, any>;

	constructor(defnName: string, targetsByName: Map<string,any>)
	{
		this.defnName = defnName;
		this.targetsByName = targetsByName || new Map<string,any>([]);
	}

	static fromDefnName(defnName: string): Activity
	{
		return new Activity(defnName, null);
	}

	static fromDefnNameAndTarget(defnName: string, target: any): Activity
	{
		return new Activity
		(
			defnName,
			new Map<string,any>
			([
				[ defnName, target ]
			])
		);
	}

	clear(): Activity
	{
		this.defnName = ActivityDefn.Instances().DoNothing.name;
		this.targetClear();
		return this;
	}

	defn(world: World): ActivityDefn
	{
		return world.defn.activityDefnByName(this.defnName);
	}

	defnNameAndTargetSet(defnName: string, target: any): Activity
	{
		this.defnName = defnName;
		this.targetSet(target);
		return this;
	}

	perform(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.defnName != null)
		{
			var defn = this.defn(uwpe.world);
			defn.perform(uwpe);
		}
	}

	target(): any
	{
		return this.targetByName(this.defnName);
	}

	targetByName(targetName: string): any
	{
		return this.targetsByName.get(targetName);
	}

	targetClear(): Activity
	{
		this.targetClearByName(this.defnName);
		return this;
	}

	targetClearByName(name: string): Activity
	{
		this.targetsByName.delete(name);
		return this;
	}

	targetSet(value: any): Activity
	{
		this.targetSetByName(this.defnName, value);
		return this;
	}

	targetSetByName(name: string, value: any): Activity
	{
		this.targetsByName.set(name, value);
		return this;
	}

	// Clonable.

	clone(): Activity
	{
		return Activity.fromDefnName(this.defnName);
	}

	overwriteWith(other: Activity): Activity
	{
		this.defnName = other.defnName;
		return this;
	}
}

}
