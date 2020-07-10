
class Defns
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
}
