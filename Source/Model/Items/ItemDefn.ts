
class ItemDefn
{
	name: string;
	appearance: string;
	description: string;
	mass: number;
	tradeValue: number;
	stackSizeMax: number;
	categoryNames: string[];
	_use: (u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity) => string;
	visual: Visual;

	constructor
	(
		name: string, appearance: string, description: string, mass: number,
		tradeValue: number, stackSizeMax: number, categoryNames: string[],
		use: (u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity) => string,
		visual: Visual
	)
	{
		this.name = name;

		this.appearance = appearance || name;
		this.description = description;
		this.mass = mass || 1;
		this.tradeValue = tradeValue;
		this.stackSizeMax = stackSizeMax || Number.POSITIVE_INFINITY;
		this.categoryNames = categoryNames || [];
		this._use = use;
		this.visual = visual;
	}

	static new1(name: string)
	{
		return new ItemDefn(name, null, null, null, null, null, null, null, null);
	}

	static fromNameCategoryNameAndUse(name: string, categoryName: string, use: any)
	{
		var returnValue = ItemDefn.new1(name);
		returnValue.categoryNames = [ categoryName ];
		returnValue.use = use;
		return returnValue;
	}

	static fromNameAndUse(name: string, use: any)
	{
		var returnValue = ItemDefn.new1(name);
		returnValue.use = use;
		return returnValue;
	}

	use(u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity)
	{
		var returnValue;
		if (this._use == null)
		{
			returnValue = "Can't use " + this.name + ".";
		}
		else
		{
			returnValue = this._use(u, w, p, eUsing, eUsed);
		}
		return returnValue;
	}
}
