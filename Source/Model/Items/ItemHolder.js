
function ItemHolder(items)
{
	this.items = items || [];
	this.items.addLookups("name");
}
{
	ItemHolder.prototype.hasItems = function(itemToCheck)
	{
		var itemExisting = this.items[itemToCheck.defnName];
		var itemExistingQuantity = (itemExisting == null ? 0 : itemExisting.quantity);
		var returnValue = (itemExistingQuantity >= itemToCheck.quantity);
		return returnValue;
	}

	ItemHolder.prototype.itemAdd = function(itemToAdd)
	{
		var itemDefnName = itemToAdd.defnName;
		var itemExisting = this.items[itemDefnName];
		if (itemExisting == null)
		{
			this.items.push(itemToAdd);
			this.items[itemDefnName] = itemToAdd;
		}
		else
		{
			itemExisting.quantity += itemToAdd.quantity;
		}
	}

	ItemHolder.prototype.itemSubtract = function(itemToSubtract)
	{
		var itemDefnName = itemToSubtract.defnName;
		var itemExisting = this.items[itemDefnName];
		if (itemExisting != null)
		{
			itemExisting.quantity -= itemToSubtract.quantity;
			if (itemExisting.quantity <= 0)
			{
				this.items.remove(itemExisting);
				delete this.items[itemDefnName];
			}
		}
	}
}
