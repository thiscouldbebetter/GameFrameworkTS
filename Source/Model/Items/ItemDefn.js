
function ItemDefn(name, appearance, description, mass, stackSizeMax, relativeFrequency, categoryNames, initialize, use)
{
	this.name = name;

	this.appearance = appearance || name;
	this.description = description;
	this.mass = mass || 1;
	this.stackSizeMax = stackSizeMax || Number.POSITIVE_INFINITY;
	this.relativeFrequency = relativeFrequency;
	this.categoryNames = categoryNames || [];
	this.initialize = initialize;
	this.use = use;
}
{
	ItemDefn.fromNameCategoryNameAndUse = function(name, categoryName, use)
	{
		var returnValue = new ItemDefn(name);
		returnValue.categoryNames = [ categoryName ];
		returnValue.use = use;
		return returnValue;
	};

	ItemDefn.fromNameAndUse = function(name, use)
	{
		var returnValue = new ItemDefn(name);
		returnValue.use = use;
		return returnValue;
	};
}
