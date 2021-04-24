
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
			if (defnsOfType.length > 0)
			{
				var itemFirst = defnsOfType[0];
				var itemTypeName = itemFirst.constructor.name;
				this.defnArraysByTypeName.set(itemTypeName, defnsOfType);
				this.defnsByNameByTypeName.set(itemTypeName, defnsByName);
			}
		}
	}

	// Convenience methods.

	actionByName(defnName: string)
	{
		var defnsByName = this.defnsByNameByTypeName.get(Action.name)
		var returnValue = defnsByName.get(defnName);
		return returnValue;
	}

	activityDefnByName(defnName: string)
	{
		var defnsByName = this.defnsByNameByTypeName.get(ActivityDefn.name)
		var returnValue = defnsByName.get(defnName);
		return returnValue;
	}

	entityDefnByName(defnName: string)
	{
		var defnsByName = this.defnsByNameByTypeName.get(Entity.name)
		var returnValue = defnsByName.get(defnName);
		return returnValue;
	}

	itemDefnByName(defnName: string)
	{
		var defnsByName = this.defnsByNameByTypeName.get(ItemDefn.name)
		var returnValue = defnsByName.get(defnName);
		return returnValue;
	}

	placeDefnByName(defnName: string)
	{
		var defnsByName = this.defnsByNameByTypeName.get(PlaceDefn.name)
		var returnValue = defnsByName.get(defnName);
		return returnValue;
	}

}

}
