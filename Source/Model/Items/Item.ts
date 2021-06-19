
namespace ThisCouldBeBetter.GameFramework
{

export class Item implements EntityProperty
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

	use(uwpe: UniverseWorldPlaceEntities): any
	{
		var returnValue = null;
		var defn = this.defn(uwpe.world);
		if (defn.use != null)
		{
			returnValue = defn.use
			(
				uwpe
			);
		}
		return returnValue;
	}

	// cloneable

	clone(): Item
	{
		return new Item(this.defnName, this.quantity);
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
}

}
