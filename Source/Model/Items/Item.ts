
namespace ThisCouldBeBetter.GameFramework
{

export class Item implements EntityProperty<Item>
{
	defnName: string;
	quantity: number;

	_entity: Entity;

	constructor(defnName: string, quantity: number)
	{
		this.defnName = defnName;
		this.quantity = (quantity == null) ? 1 : quantity;
	}

	static fromDefnName(defnName: string)
	{
		return new Item(defnName, 1);
	}

	belongsToCategory(category: ItemCategory, world: World): boolean
	{
		return this.defn(world).belongsToCategory(category);
	}

	belongsToCategoryWithName(categoryName: string, world: World): boolean
	{
		return this.defn(world).belongsToCategoryWithName(categoryName);
	}

	defn(world: World): ItemDefn
	{
		return world.defn.itemDefnByName(this.defnName);
	}

	encumbrance(world: World): number
	{
		return this.quantity * this.defn(world).encumbrance;
	}

	isUsable(world: World): boolean
	{
		return (this.defn(world).use != null);
	}

	quantityAdd(increment: number): Item
	{
		return this.quantitySet(this.quantity + increment);
	}

	quantityClear(): Item
	{
		return this.quantitySet(0);
	}

	quantitySet(value: number): Item
	{
		this.quantity = value;
		return this;
	}

	quantitySubtract(decrement: number): Item
	{
		if (this.quantity < decrement)
		{
			throw new Error("Cannot subtract more than total quantity of item '" + this.defnName + "'.");
		}

		return this.quantitySet(this.quantity - decrement);
	}

	toEntity(uwpe: UniverseWorldPlaceEntities): Entity
	{
		if (this._entity == null)
		{
			var defn = this.defn(uwpe.world);
			this._entity = defn.toEntity(uwpe, this);
		}
		return this._entity;
	}

	toString(world: World): string
	{
		return this.defn(world).appearance + " (" + this.quantity + ")";
	}

	tradeValue(world: World): number
	{
		return this.quantity * this.defn(world).tradeValue;
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.entity2Set(this.toEntity(uwpe) );
		var defn = this.defn(uwpe.world);
		defn.use(uwpe);
	}

	// Clonable.

	clone(): Item
	{
		return new Item(this.defnName, this.quantity);
	}

	overwriteWith(other: Item): Item
	{
		this.defnName = other.defnName;
		this.quantity = other.quantity;
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	propertyName(): string { return Item.name; }

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Item): boolean { return false; } // todo

}

}
