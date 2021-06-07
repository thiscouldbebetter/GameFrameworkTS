
namespace ThisCouldBeBetter.GameFramework
{

export class ItemDefn implements EntityProperty
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
	_toEntity: (u: Universe, w: World, p: Place, e: Entity, i: Item) => Entity;

	constructor
	(
		name: string,
		appearance: string,
		description: string,
		mass: number,
		tradeValue: number,
		stackSizeMax: number,
		categoryNames: string[],
		use: (u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity) => string,
		visual: Visual,
		toEntity: (u: Universe, w: World, p: Place, e: Entity, i: Item) => Entity
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
		this._toEntity = toEntity;
	}

	static fromName(name: string): ItemDefn
	{
		return new ItemDefn
		(
			name, null, null, null, null, null, null, null, null, null
		);
	}

	static fromNameCategoryNameAndUse
	(
		name: string,
		categoryName: string,
		use: (u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity) => string
	): ItemDefn
	{
		var returnValue = ItemDefn.fromName(name);
		returnValue.categoryNames = [ categoryName ];
		returnValue.use = use;
		return returnValue;
	}

	static fromNameAndUse
	(
		name: string,
		use: (u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity) => string
	): ItemDefn
	{
		var returnValue = ItemDefn.fromName(name);
		returnValue.use = use;
		return returnValue;
	}

	static fromNameMassValueAndVisual
	(
		name: string, mass: number, tradeValue: number, visual: Visual
	): ItemDefn
	{
		return new ItemDefn
		(
			name, null, null, mass, tradeValue, null, null, null, visual, null
		);
	}

	toEntity(u: Universe, w: World, p: Place, e: Entity, item: Item): Entity
	{
		var returnValue;
		if (this._toEntity == null)
		{
			returnValue = new Entity(this.name, [ item ]);
		}
		else
		{
			returnValue = this._toEntity.call(this, u, w, p, e, item);
		}

		return returnValue;
	}

	use(u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity): any
	{
		var returnValue;
		if (this._use == null)
		{
			returnValue = "Can't use " + this.appearance + ".";
		}
		else
		{
			returnValue = this._use(u, w, p, eUsing, eUsed);
		}

		return returnValue;
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
}

}
