
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

	toEntity(u: Universe, w: World, p: Place, e: Entity): Entity
	{
		if (this._entity == null)
		{
			var defn = this.defn(w);
			this._entity = defn.toEntity(u, w, p, e, this);
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

	use
	(
		universe: Universe, world: World, place: Place,
		userEntity: Entity, itemEntity: Entity
	): any
	{
		var returnValue = null;
		var defn = this.defn(world);
		if (defn.use != null)
		{
			returnValue = defn.use
			(
				universe, world, place, userEntity, itemEntity
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

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
}

}
