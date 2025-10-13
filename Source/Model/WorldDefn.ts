
namespace ThisCouldBeBetter.GameFramework
{

export class WorldDefn
{
	actions: Action[];
	activityDefns: ActivityDefn[];
	entityDefns: Entity[];
	itemDefns: ItemDefn[];
	placeDefns: PlaceDefn[];
	scripts: Script[];
	skills: Skill[];

	actionsByName: Map<string, Action>;
	activityDefnsByName: Map<string, ActivityDefn>;
	entityDefnsByName: Map<string, Entity>;
	itemDefnsByName: Map<string, ItemDefn>;
	placeDefnsByName: Map<string, PlaceDefn>;
	scriptsByName: Map<string, Script>;
	skillsByName: Map<string, Skill>;

	constructor(defnArrays: unknown[][])
	{
		for (var i = 0; i < defnArrays.length; i++)
		{
			var defns = defnArrays[i];
			if (defns.length > 0)
			{
				var defn0 = defns[0];
				var defnTypeName = defn0.constructor.name;

				var notDefined = "undefined";
				if
				(
					typeof(Action) != notDefined
					&& defnTypeName == Action.name
				)
				{
					this.actions = defns as Array<Action>;
					this.actionsByName =
						ArrayHelper.addLookupsByName(this.actions);
				}
				else if
				(
					typeof(ActivityDefn) != notDefined
					&& defnTypeName == ActivityDefn.name
				)
				{
					this.activityDefns = defns as Array<ActivityDefn>;
					this.activityDefnsByName =
						ArrayHelper.addLookupsByName(this.activityDefns);
				}
				else if
				(
					typeof(Entity) != notDefined
					&& defnTypeName == Entity.name
				)
				{
					this.entityDefnsInitialize(defns as Entity[]);
				}
				else if
				(
					typeof(ItemDefn) != notDefined
					&& defnTypeName == ItemDefn.name
				)
				{
					this.itemDefnsInitialize(defns as ItemDefn[]);
				}
				else if
				(
					typeof(PlaceDefn) != notDefined
					&& defnTypeName == PlaceDefn.name
				)
				{
					this.placeDefns = defns as Array<PlaceDefn>;
					this.placeDefnsByName =
						ArrayHelper.addLookupsByName(this.placeDefns);
				}
				else if
				(
					typeof(Script) != notDefined
					&& defnTypeName == Script.name
				)
				{
					this.scripts = defns as Array<Script>;
					this.scriptsByName =
						ArrayHelper.addLookupsByName(this.scripts);
				}
				else if
				(
					typeof(Skill) != notDefined
					&& defnTypeName == Skill.name
				)
				{
					this.skills = defns as Array<Skill>;
					this.skillsByName =
						ArrayHelper.addLookupsByName(this.skills);
				}
				else
				{
					throw new Error("Unrecognized defn type: " + defnTypeName);
				}
			}
		}
	}

	static default(): WorldDefn
	{
		return new WorldDefn([]);
	}

	static from7 // ActionActivityEntityItemyPlaceAndSkillDefns
	(
		actions: Action[],
		activityDefns: ActivityDefn[],
		entityDefns: Entity[],
		itemDefns: ItemDefn[],
		placeDefns: PlaceDefn[],
		scripts: Script[],
		skills: Skill[]
	): WorldDefn
	{
		return new WorldDefn
		([
			actions,
			activityDefns,
			entityDefns,
			itemDefns,
			placeDefns,
			scripts,
			skills
		]);
	}

	static fromDefnArrays(defnArrays: unknown[][]): WorldDefn
	{
		return new WorldDefn(defnArrays);
	}

	static fromPlaceDefns(placeDefns: PlaceDefn[]): WorldDefn
	{
		return new WorldDefn([ placeDefns ]);
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

	entityDefnsInitialize(defns: Entity[]): void
	{
		defns = defns || [];
		this.entityDefns = defns as Array<Entity>;
		this.entityDefnsByName =
			ArrayHelper.addLookupsByName(this.entityDefns);
	}

	itemDefnAdd(itemDefn: ItemDefn): WorldDefn
	{
		this.itemDefns.push(itemDefn);
		this.itemDefnsByName.set(itemDefn.name, itemDefn);
		return this;
	}

	itemDefnByName(defnName: string): ItemDefn
	{
		var returnValue = this.itemDefnsByName.get(defnName);
		return returnValue;
	}

	itemDefnsInitialize(defns: ItemDefn[]): void
	{
		defns = defns || [];
		this.itemDefns = defns as Array<ItemDefn>;
		this.itemDefnsByName =
			ArrayHelper.addLookupsByName(this.itemDefns);
	}

	placeDefnByName(defnName: string): PlaceDefn
	{
		var returnValue =
			this.placeDefnsByName == null
			? null
			: this.placeDefnsByName.get(defnName);

		return returnValue;
	}

	scriptAdd(script: Script): WorldDefn
	{
		this.scripts.push(script);
		this.scriptsByName.set(script.name, script);
		return this;
	}

	scriptByName(name: string): Script
	{
		var returnValue =
			this.scriptsByName == null
			? null
			: this.scriptsByName.get(name);

		return returnValue;
	}

}

}
