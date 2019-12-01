
function ItemDefn(name, appearance, mass, stackSizeMax, relativeFrequency, categoryNames, initialize, use)
{
	this.name = name;

	this.appearance = appearance;
	this.mass = mass;
	this.stackSizeMax = stackSizeMax;
	this.relativeFrequency = relativeFrequency;
	this.categoryNames = categoryNames;
	this.initialize = initialize;
	this.use = use;
}
