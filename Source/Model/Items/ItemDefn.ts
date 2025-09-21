
namespace ThisCouldBeBetter.GameFramework
{

export class ItemDefn extends EntityPropertyBase<ItemDefn>
{
	name: string;
	appearance: string;
	description: string;
	encumbrance: number;
	tradeValue: number;
	stackSizeMax: number;
	categoryNames: string[];
	_use: (uwpe: UniverseWorldPlaceEntities) => void;
	visual: Visual;
	_toEntity: (uwpe: UniverseWorldPlaceEntities, i: Item) => Entity;

	constructor
	(
		name: string,
		appearance: string,
		description: string,
		encumbrance: number,
		tradeValue: number,
		stackSizeMax: number,
		categoryNames: string[],
		use: (uwpe: UniverseWorldPlaceEntities) => void,
		visual: Visual,
		toEntity: (uwpe: UniverseWorldPlaceEntities, i: Item) => Entity
	)
	{
		super();

		this.name = name;

		this.appearance = appearance || name;
		this.description = description;
		this.encumbrance = encumbrance || 1;
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

	static fromNameAndAppearance
	(
		name: string, appearance: string
	): ItemDefn
	{
		return new ItemDefn
		(
			name, appearance,
			null, null, null, null, null, null, null, null
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

	static fromNameEncumbranceValueAndVisual
	(
		name: string, encumbrance: number, tradeValue: number, visual: Visual
	): ItemDefn
	{
		return new ItemDefn
		(
			name, null, null, encumbrance, tradeValue, null, null, null, visual, null
		);
	}

	static fromNameEncumbranceValueCategoryNameUseAndVisual
	(
		name: string,
		encumbrance: number,
		tradeValue: number,
		categoryName: string,
		use: (uwpe: UniverseWorldPlaceEntities) => void,
		visual: Visual
	): ItemDefn
	{
		return new ItemDefn
		(
			name, null, null,
			encumbrance, tradeValue, null,
			[ categoryName ],
			use,
			visual, null
		);
	}

	static fromNameEncumbranceValueCategoryNamesUseAndVisual
	(
		name: string,
		encumbrance: number,
		tradeValue: number,
		categoryNames: string[],
		use: (uwpe: UniverseWorldPlaceEntities) => void,
		visual: Visual
	): ItemDefn
	{
		return new ItemDefn
		(
			name, null, null,
			encumbrance, tradeValue, null,
			categoryNames, null,
			visual, null
		);
	}

	belongsToCategory(categoryToCheck: ItemCategory): boolean
	{
		return this.belongsToCategoryWithName(categoryToCheck.name);
	}

	belongsToCategoryWithName(categoryToCheckName: string): boolean
	{
		return (this.categoryNames.indexOf(categoryToCheckName) >= 0);
	}

	categoryNameAdd(categoryName: string): ItemDefn
	{
		this.categoryNames.push(categoryName);
		return this;
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

	toItem(): Item
	{
		return new Item(this.name, 1);
	}

	use(uwpe: UniverseWorldPlaceEntities)
	{
		if (this._use == null)
		{
			var itemHolder = ItemHolder.of(uwpe.entity);
			itemHolder.statusMessageSet("Can't use " + this.appearance + ".");
		}
		else
		{
			this._use(uwpe);
		}
	}

	// Clonable.

	clone(): ItemDefn { return this; }

}

}
