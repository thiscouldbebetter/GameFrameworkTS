
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
		if (inputToHandle == "Enter" || inputToHandle == "ArrowDown")
		{
			this.itemSelectedNextInDirection(1);
		}
		else if (inputToHandle == "ArrowUp")
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
	
	// drawable
	
	ControlList.prototype.draw = function()
	{
		var list = this;
		var display = Globals.Instance.display;
		
		var pos = list.pos
		var size = list.size;

		display.drawRectangle
		(
			pos, size, 
			display.colorBack, display.colorFore, 
			list.isHighlighted // areColorsReversed
		);

		display.graphics.fillStyle = (list.isHighlighted == true ? display.colorBack : display.colorFore);
		display.graphics.strokeStyle = (list.isHighlighted == true ? display.colorBack : display.colorFore);

		var itemSizeY = list.itemSpacing;
		var textMarginLeft = 2;
		var itemPosY = pos.y;

		var items = list.items();

		var numberOfItemsVisible = Math.floor(size.y / itemSizeY);
		var indexStart = list.indexOfFirstItemVisible;
		var indexEnd = indexStart + numberOfItemsVisible - 1;
		if (indexEnd >= items.length)
		{
			indexEnd = items.length - 1;
		}

		for (var i = indexStart; i <= indexEnd; i++)
		{
			if (i == list.indexOfItemSelected)
			{
				display.graphics.strokeRect
				(
					pos.x + textMarginLeft, 
					itemPosY,
					size.x - textMarginLeft * 2,
					itemSizeY
				)
			}

			var item = items[i];
			var text = DataBinding.get
			(
				item, list.bindingExpressionForItemText
			);

			var drawPos = new Coords(pos.x + textMarginLeft, itemPosY);

			display.drawText(text, drawPos, display.colorFore, display.colorBack, list.isHighlighted);
			
			itemPosY += itemSizeY;
		}
	}

}
