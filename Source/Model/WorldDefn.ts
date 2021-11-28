
namespace ThisCouldBeBetter.GameFramework
{

export class WorldDefn
{
	actions: Action[];
	activityDefns: ActivityDefn[];
	entityDefns: Entity[];
	itemDefns: ItemDefn[];
	placeDefns: PlaceDefn[];
	skills: Skill[];

	actionsByName: Map<string, Action>;
	activityDefnsByName: Map<string, ActivityDefn>;
	entityDefnsByName: Map<string, Entity>;
	itemDefnsByName: Map<string, ItemDefn>;
	placeDefnsByName: Map<string, PlaceDefn>;
	skillsByName: Map<string, Skill>;

	constructor
	(
		actions: Action[],
		activityDefns: ActivityDefn[],
		entityDefns: Entity[],
		itemDefns: ItemDefn[],
		placeDefns: PlaceDefn[],
		skills: Skill[]
	)
	{
		this.actions = actions || [];
		this.activityDefns = activityDefns || [];
		this.entityDefns = entityDefns || [];
		this.itemDefns = itemDefns || [];
		this.placeDefns = placeDefns || [];
		this.skills = skills || [];

		this.actionsByName = ArrayHelper.addLookupsByName(this.actions);
		this.activityDefnsByName = ArrayHelper.addLookupsByName(this.activityDefns);
		this.entityDefnsByName = ArrayHelper.addLookupsByName(this.entityDefns);
		this.itemDefnsByName = ArrayHelper.addLookupsByName(this.itemDefns);
		this.placeDefnsByName = ArrayHelper.addLookupsByName(this.placeDefns);
		this.skillsByName = ArrayHelper.addLookupsByName(this.skills);
	}

	static default(): WorldDefn
	{
		return new WorldDefn(null, null, null, null, null, null);
	}

	static fromPlaceDefns(placeDefns: PlaceDefn[]): WorldDefn
	{
		return new WorldDefn([], [], [], [], placeDefns, []);
	}

	// Convenience methods.

	actionByName(defnName: string): Action
	{
		var returnValue = this.actionsByName.get(defnName);
		return returnValue;
	}

	activityDefnByName(defnName: string): ActivityDefn
	{
		var returnValue = this.activityDefnsByName.get(defnName);
		return returnValue;
	}

	entityDefnByName(defnName: string): Entity
	{
		var returnValue = this.entityDefnsByName.get(defnName);
		return returnValue;
	}

	itemDefnByName(defnName: string): ItemDefn
	{
		var returnValue = this.itemDefnsByName.get(defnName);
		return returnValue;
	}

	placeDefnByName(defnName: string): PlaceDefn
	{
		var returnValue = this.placeDefnsByName.get(defnName);
		return returnValue;
	}

}

}
