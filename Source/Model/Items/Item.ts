
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

	defn(world: World)
	{
		return world.defn.itemDefnsByName().get(this.defnName);
	}

	isUsable(world: World)
	{
		return (this.defn(world).use != null);
	}

	mass(world: World)
	{
		return this.quantity * this.defn(world).mass;
	}

	toEntity()
	{
		// todo
		return new Entity(this.defnName, [ this ]);
	}

	toString(world: World)
	{
		return this.defn(world).appearance + " (" + this.quantity + ")";
	}

	tradeValue(world: World)
	{
		return this.quantity * this.defn(world).tradeValue;
	}

	use(universe: Universe, world: World, place: Place, userEntity: Entity, itemEntity: Entity)
	{
		var returnValue = null;
		var defn = this.defn(world);
		if (defn.use != null)
		{
			returnValue = defn.use(universe, world, place, userEntity, itemEntity, this);
		}
		return returnValue;
	}

	// cloneable

	clone()
	{
		return new Item(this.defnName, this.quantity);
	}
}

}
