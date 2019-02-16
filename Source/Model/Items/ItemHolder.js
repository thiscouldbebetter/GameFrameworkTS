
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
	};

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
	};

	ItemHolder.prototype.itemRemove = function(itemToRemove)
	{
		var itemDefnName = itemToRemove.defnName;
		var itemExisting = this.items[itemDefnName];
		if (itemExisting != null)
		{
			this.items.remove(itemExisting);
			delete this.items[itemDefnName];
		}
	};

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
	};

	ItemHolder.prototype.itemsTransferTo = function(other)
	{
		for (var i = 0; i < this.items.length; i++)
		{
			var item = this.items[i];
			other.itemAdd(item);
			this.itemRemove(item);
		}
	};
}
