
class Defns
{
	constructor(defnArrays)
	{
		for (var i = 0; i < defnArrays.length; i++)
		{
			var defns = defnArrays[i];
			defns.addLookupsByName();

			var itemFirst = defns[0];
			var itemTypeName = itemFirst.constructor.name;
			itemTypeName = itemTypeName.lowercaseFirstCharacter();
			var collectionName = itemTypeName + "s";
			this[collectionName] = defns;
		}
	}
}
