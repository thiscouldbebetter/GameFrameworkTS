
function ItemHolder(itemEntities)
{
	this.itemEntities = itemEntities || [];
	for (var i = 0; i < this.itemEntities.length; i++)
	{
		var itemEntity = this.itemEntities[i];
		this.itemEntityAdd(itemEntity);
	}
}
{
	ItemHolder.prototype.hasItems = function(itemToCheck)
	{
		var itemEntityExisting = this.itemEntities[itemToCheck.defnName];
		var itemExistingQuantity = (itemEntityExisting == null ? 0 : itemEntityExisting.Item.quantity);
		var returnValue = (itemExistingQuantity >= itemToCheck.quantity);
		return returnValue;
	};

	ItemHolder.prototype.itemEntityAdd = function(itemEntityToAdd)
	{
		var itemToAdd = itemEntityToAdd.Item;
		var itemDefnName = itemToAdd.defnName;
		var itemEntityExisting = this.itemEntities[itemDefnName];
		if (itemEntityExisting == null)
		{
			this.itemEntities.push(itemEntityToAdd);
			this.itemEntities[itemDefnName] = itemEntityToAdd;
		}
		else
		{
			itemEntityExisting.Item.quantity += itemToAdd.quantity;
		}
	};

	ItemHolder.prototype.itemRemove = function(itemToRemove)
	{
		var itemDefnName = itemToRemove.defnName;
		var itemEntityExisting = this.itemEntities[itemDefnName];
		if (itemEntityExisting != null)
		{
			this.itemEntities.remove(itemEntityExisting);
			delete this.itemEntities[itemDefnName];
		}
	};

	ItemHolder.prototype.itemSubtract = function(itemToSubtract)
	{
		var itemDefnName = itemToSubtract.defnName;
		var itemEntityExisting = this.itemEntities[itemDefnName];
		if (itemEntityExisting != null)
		{
			var itemExisting = itemEntityExisting.Item;
			itemExisting.quantity -= itemToSubtract.quantity;
			if (itemExisting.quantity <= 0)
			{
				this.itemEntities.remove(itemEntityExisting);
				delete this.itemEntities[itemDefnName];
			}
		}
	};

	ItemHolder.prototype.itemsTransferTo = function(other)
	{
		for (var i = 0; i < this.itemEntities.length; i++)
		{
			var itemEntity = this.itemEntities[i];
			other.itemEntityAdd(itemEntity);
			this.itemRemove(itemEntity.Item);
		}
	};
}
