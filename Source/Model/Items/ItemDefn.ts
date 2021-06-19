
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
	_use: (uwpe: UniverseWorldPlaceEntities) => string;
	visual: Visual;
	_toEntity: (uwpe: UniverseWorldPlaceEntities, i: Item) => Entity;

	constructor
	(
		name: string,
		appearance: string,
		description: string,
		mass: number,
		tradeValue: number,
		stackSizeMax: number,
		categoryNames: string[],
		use: (uwpe: UniverseWorldPlaceEntities) => string,
		visual: Visual,
		toEntity: (uwpe: UniverseWorldPlaceEntities, i: Item) => Entity
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
		use: (uwpe: UniverseWorldPlaceEntities) => string
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
		use: (uwpe: UniverseWorldPlaceEntities) => string
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

	toEntity(uwpe: UniverseWorldPlaceEntities, item: Item): Entity
	{
		var returnValue;
		if (this._toEntity == null)
		{
			returnValue = new Entity(this.name, [ item ]);
		}
		else
		{
			returnValue = this._toEntity.call(this, uwpe, item);
		}

		return returnValue;
	}

	use(uwpe: UniverseWorldPlaceEntities): any
	{
		var returnValue;
		if (this._use == null)
		{
			returnValue = "Can't use " + this.appearance + ".";
		}
		else
		{
			returnValue = this._use(uwpe);
		}

		return returnValue;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
}

}
