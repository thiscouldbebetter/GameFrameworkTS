
class ItemDefn
{
	constructor(name, appearance, description, mass, tradeValue, stackSizeMax, categoryNames, use)
	{
		this.name = name;

		this.appearance = appearance || name;
		this.description = description;
		this.mass = mass || 1;
		this.tradeValue = tradeValue;
		this.stackSizeMax = stackSizeMax || Number.POSITIVE_INFINITY;
		this.categoryNames = categoryNames || [];
		this.use = use;
	}

	static fromNameCategoryNameAndUse(name, categoryName, use)
	{
		var returnValue = new ItemDefn(name);
		returnValue.categoryNames = [ categoryName ];
		returnValue.use = use;
		return returnValue;
	};

	static fromNameAndUse(name, use)
	{
		var returnValue = new ItemDefn(name);
		returnValue.use = use;
		return returnValue;
	};
}
