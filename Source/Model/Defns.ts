
class Defns
{
	defnArraysByTypeName: any;
	defnsByNameByTypeName: any;

	constructor(defnArrays: any)
	{
		this.defnArraysByTypeName = {};
		this.defnsByNameByTypeName = {};

		for (var i = 0; i < defnArrays.length; i++)
		{
			var defnsOfType = defnArrays[i];
			var defnsByName = ArrayHelper.addLookupsByName(defnsOfType);
			var itemFirst = defnsOfType[0];
			var itemTypeName = itemFirst.constructor.name;
			this.defnArraysByTypeName[itemTypeName] = defnsOfType;
			this.defnsByNameByTypeName[itemTypeName] = defnsByName;
		}
	}
}
