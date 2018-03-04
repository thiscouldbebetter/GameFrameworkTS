
function Item(defnName, quantity)
{
	this.defnName = defnName;
	this.quantity = quantity;
}
{
	Item.prototype.defn = function(world)
	{
		return world.defns.itemDefns[this.defnName];
	}
}
