
namespace ThisCouldBeBetter.GameFramework
{

export class Item extends EntityProperty
{
	defnName: string;
	quantity: number;

	constructor(defnName: string, quantity: number)
	{
		super();
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

	toEntity(): Entity
	{
		return new Entity(this.defnName, [ this ]);
	}

	toString(world: World): string
	{
		return this.defn(world).appearance + " (" + this.quantity + ")";
	}

	tradeValue(world: World): number
	{
		return this.quantity * this.defn(world).tradeValue;
	}

	use(universe: Universe, world: World, place: Place, userEntity: Entity, itemEntity: Entity): any
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
}

}
