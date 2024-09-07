
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
		this.quantity = quantity;
	}

	defn(world: World): ItemDefn
	{
		return world.defn.itemDefnByName(this.defnName);
	}

	isUsable(world: World): boolean
	{
		return (this.defn(world).use != null);
	}

	mass(world: World): number
	{
		return this.quantity * this.defn(world).mass;
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

	// cloneable

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
