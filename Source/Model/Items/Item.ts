
class Item
{
	constructor(defnName, quantity)
	{
		this.defnName = defnName;
		this.quantity = quantity;
	}

	defn(world)
	{
		return world.defns.itemDefns[this.defnName];
	};

	isUsable(world)
	{
		return (this.defn(world).use != null);
	};

	toEntity()
	{
		// todo
		return new Entity(this.defnName, [ this ]);
	};

	toString(world)
	{
		return this.defn(world).appearance + " (" + this.quantity + ")";
	};

	tradeValue(world)
	{
		return this.quantity * this.defn(world).tradeValue;
	};

	use(universe, world, place, userEntity, itemEntity)
	{
		var returnValue = null;
		var defn = this.defn(world);
		if (defn.use != null)
		{
			returnValue = defn.use(universe, world, place, userEntity, itemEntity, this);
		}
		return returnValue;
	};

	// cloneable

	clone()
	{
		return new Item(this.defnName, this.quantity);
	};
}
