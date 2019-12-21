
function ItemDefn(name, appearance, mass, stackSizeMax, relativeFrequency, categoryNames, initialize, use)
{
	this.name = name;

	this.appearance = appearance || name;
	this.mass = mass || 1;
	this.stackSizeMax = stackSizeMax || Number.POSITIVE_INFINITY;
	this.relativeFrequency = relativeFrequency;
	this.categoryNames = categoryNames;
	this.initialize = initialize;
	this.use = use;
}
