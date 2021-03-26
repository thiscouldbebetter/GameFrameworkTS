
namespace ThisCouldBeBetter.GameFramework
{

export class WorldDefn
{
	defnArraysByTypeName: Map<string, any[]>;
	defnsByNameByTypeName: Map<string, Map<string, any>>;

	constructor(defnArrays: any[])
	{
		this.defnArraysByTypeName = new Map<string, any[]>();
		this.defnsByNameByTypeName = new Map<string, Map<string, any>>();

		for (var i = 0; i < defnArrays.length; i++)
		{
			var defnsOfType = defnArrays[i];
			var defnsByName = ArrayHelper.addLookupsByName(defnsOfType);
			var itemFirst = defnsOfType[0];
			var itemTypeName = itemFirst.constructor.name;
			this.defnArraysByTypeName.set(itemTypeName, defnsOfType);
			this.defnsByNameByTypeName.set(itemTypeName, defnsByName);
		}
	}

	// Convenience methods.

	actionDefnByName(defnName: string)
	{
		return this.defnsByNameByTypeName.get(Action.name).get(defnName);
	}

	activityDefnByName(defnName: string)
	{
		return this.defnsByNameByTypeName.get(ActivityDefn.name).get(defnName);
	}

	entityDefnByName(defnName: string)
	{
		return this.defnsByNameByTypeName.get(Entity.name).get(defnName);
	}

	itemDefnByName(defnName: string)
	{
		return this.defnsByNameByTypeName.get(ItemDefn.name).get(defnName);
	}

	placeDefnByName(defnName: string)
	{
		return this.defnsByNameByTypeName.get(PlaceDefn.name).get(defnName);
	}

}

}
