
namespace ThisCouldBeBetter.GameFramework
{

export class Activity
{
	defnName: string;
	targetEntitiesByName: Map<string, Entity>;

	constructor
	(
		defnName: string,
		targetEntitiesByName: Map<string, Entity>
	)
	{
		this.defnName = defnName;
		this.targetEntitiesByName =
			targetEntitiesByName || new Map<string, Entity>([]);
	}

	static fromDefnName(defnName: string): Activity
	{
		return new Activity(defnName, null);
	}

	static fromDefnNameAndTargetEntity
	(
		defnName: string, target: Entity
	): Activity
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
		this.targetEntityClear();
		return this;
	}

	defn(world: World): ActivityDefn
	{
		return world.defn.activityDefnByName(this.defnName);
	}

	defnNameAndTargetEntitySet
	(
		defnName: string, targetEntity: Entity
	): Activity
	{
		this.defnName = defnName;
		this.targetEntitySet(targetEntity);
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

	targetEntity(): Entity
	{
		return this.targetEntityByName(this.defnName);
	}

	targetEntityByName(targetEntityName: string): Entity
	{
		return this.targetEntitiesByName.get(targetEntityName);
	}

	targetEntityClear(): Activity
	{
		this.targetEntityClearByName(this.defnName);
		return this;
	}

	targetEntityClearByName(name: string): Activity
	{
		this.targetEntitiesByName.delete(name);
		return this;
	}

	targetEntitySet(value: Entity): Activity
	{
		this.targetEntitySetByName(this.defnName, value);
		return this;
	}

	targetEntitySetByName(name: string, value: Entity): Activity
	{
		this.targetEntitiesByName.set(name, value);
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
