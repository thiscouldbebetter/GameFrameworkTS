
function ControlList(name, pos, size, dataBindingForItems, bindingExpressionForItemText)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.dataBindingForItems = dataBindingForItems;
	this.bindingExpressionForItemText = bindingExpressionForItemText;

	this.itemSpacing = 12; // hack

	this.indexOfItemSelected = 0;
	this.indexOfFirstItemVisible = 0;

	this.isHighlighted = false;
}

{
	ControlList.prototype.draw = function()
	{
		Globals.Instance.display.drawControlList(this);
	}

	ControlList.prototype.focusGain = function()
	{
		this.isHighlighted = true;
	}

	ControlList.prototype.focusLose = function()
	{
		this.isHighlighted = false;
	}

	ControlList.prototype.inputHandle = function(inputToHandle)
	{
		if (inputToHandle == "Enter" || inputToHandle == "ArrowRight")
		{
			this.itemSelectedNextInDirection(1);
		}
		else if (inputToHandle == "ArrowLeft")
		{
			this.itemSelectedNextInDirection(-1);			
		}
	}

	ControlList.prototype.itemSelected = function()
	{
		return (this.indexOfItemSelected == null ? null : this.items()[this.indexOfItemSelected]);
	}

	ControlList.prototype.itemSelectedNextInDirection = function(direction)
	{
		var numberOfItems = this.items().length;

		if (this.indexOfItemSelected == null)
		{
			if (numberOfItems > 0)
			{
				if (direction == 1)
				{
					this.indexOfItemSelected = 0;
				}
				else // if (direction == -1)
				{
					this.indexOfItemSelected = numberOfItems - 1;
				}
			}
		}
		else 
		{
			this.indexOfItemSelected = NumberHelper.wrapValueToRangeMinMax
			(
				this.indexOfItemSelected + direction, 0, numberOfItems
			);
		}

		return this.itemSelected();
	}

	ControlList.prototype.items = function()
	{
		return this.dataBindingForItems.get();
	}

	ControlList.prototype.mouseClick = function(clickPos)
	{
		var offsetOfItemClicked = clickPos.y - this.pos.y;
		var indexOfItemClicked = 
			this.indexOfFirstItemVisible 
			+ Math.floor
			(
				offsetOfItemClicked 
				/ this.itemSpacing
			);

		if (indexOfItemClicked <= this.items.length)
		{
			this.indexOfItemSelected = indexOfItemClicked;
		}	
	}
}
