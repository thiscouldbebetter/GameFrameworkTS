
class ItemDefn
{
	name: string;
	appearance: string;
	description: string;
	mass: number;
	tradeValue: number;
	stackSizeMax: number;
	categoryNames: string[];
	use: any;

	constructor
	(
		name: string, appearance: string, description: string, mass: number,
		tradeValue: number, stackSizeMax: number, categoryNames: string[], use: any)
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

	static new1(name: string)
	{
		return new ItemDefn(name, null, null, null, null, null, null, null);
	};

	static fromNameCategoryNameAndUse(name: string, categoryName: string, use: any)
	{
		var returnValue = ItemDefn.new1(name);
		returnValue.categoryNames = [ categoryName ];
		returnValue.use = use;
		return returnValue;
	};

	static fromNameAndUse(name: string, use: any)
	{
		var returnValue = ItemDefn.new1(name);
		returnValue.use = use;
		return returnValue;
	};
}
