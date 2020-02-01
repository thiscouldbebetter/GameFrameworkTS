
function EquipmentSocket(defnName, itemEntityEquipped)
{
	this.defnName = defnName;
	this.itemEntityEquipped = itemEntityEquipped;
}
{
	EquipmentSocket.prototype.defn = function(defnGroup)
	{
		return defnGroup.socketDefns[this.defnName];
	};

	EquipmentSocket.prototype.toString = function(world)
	{
		var itemEntityEquippedAsString =
		(
			this.itemEntityEquipped == null
			? " [empty] "
			: this.itemEntityEquipped.item.toString(world)
		);
		var returnValue = this.defnName + ": " + itemEntityEquippedAsString;
		return returnValue;
	};
}
