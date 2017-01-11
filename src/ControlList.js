
function ControlList(name, pos, size, dataBindingForItems, bindingExpressionForItemText, fontHeightInPixels)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.dataBindingForItems = dataBindingForItems;
	this.bindingExpressionForItemText = bindingExpressionForItemText;
	this.fontHeightInPixels = fontHeightInPixels;

	this.itemSpacing = 1.2 * this.fontHeightInPixels; // hack

	this.indexOfItemSelected = 0;

	this.isHighlighted = false;
	
	var scrollbarWidth = this.itemSpacing;
	this.scrollbar = new ControlScrollbar
	(
		// pos
		this.pos.clone().add
		(
			new Coords(this.size.x - scrollbarWidth, 0)
		), 
		new Coords(scrollbarWidth, this.size.y), // size
		this.fontHeightInPixels,
		this.itemSpacing,
		this.dataBindingForItems,
		0 // value
	);
}

{
	ControlList.prototype.actionHandle = function(actionNameToHandle)
	{
		if (actionNameToHandle == "ControlIncrement")
		{
			this.itemSelectedNextInDirection(1);
		}
		else if (actionNameToHandle == "ControlDecrement")
		{
			this.itemSelectedNextInDirection(-1);			
		}
	}
	
	ControlList.prototype.focusGain = function()
	{
		this.isHighlighted = true;
	}

	ControlList.prototype.focusLose = function()
	{
		this.isHighlighted = false;
	}
	
	ControlList.prototype.indexOfFirstItemVisible = function()
	{
		return this.scrollbar.sliderPosInItems;
	}
	
	ControlList.prototype.indexOfLastItemVisible = function()
	{
		return this.scrollbar.sliderPosInItems + Math.floor(this.scrollbar.windowSizeInItems) - 1;
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
			this.indexOfItemSelected = NumberHelper.trimValueToRangeMinMax
			(
				this.indexOfItemSelected + direction, 0, numberOfItems - 1
			);
		}
		
		var indexOfFirstItemVisible = this.indexOfFirstItemVisible();
		var indexOfLastItemVisible = this.indexOfLastItemVisible();
		
		if (this.indexOfItemSelected < indexOfFirstItemVisible)
		{
			this.scrollbar.sliderPosInItems--;
		}
		else if (this.indexOfItemSelected > indexOfLastItemVisible)
		{
			this.scrollbar.sliderPosInItems++;			
		}

		return this.itemSelected();
	}

	ControlList.prototype.items = function()
	{
		return this.dataBindingForItems.get();
	}

	ControlList.prototype.mouseClick = function(clickPos)
	{
		if (clickPos.x - this.pos.x > this.size.x - this.scrollbar.handleSize.x)
		{
			if (clickPos.y - this.pos.y <= this.scrollbar.handleSize.y)
			{
				this.scrollbar.scrollUp();
			}
			else if (clickPos.y - this.pos.y >= this.scrollbar.size.y - this.scrollbar.handleSize.y)
			{
				this.scrollbar.scrollDown();
			}
			else
			{
				var clickPosRelativeToSlideInPixels = clickPos.clone().subtract
				(
					this.scrollbar.pos
				).subtract
				(
					new Coords(0, this.scrollbar.handleSize.y)
				);
				
				// todo
			}
		}
		else
		{
			var offsetOfItemClicked = clickPos.y - this.pos.y;
			var indexOfItemClicked = 
				this.indexOfFirstItemVisible()
				+ Math.floor
				(
					offsetOfItemClicked 
					/ this.itemSpacing
				);

			if (indexOfItemClicked < this.items().length)
			{
				this.indexOfItemSelected = indexOfItemClicked;
			}
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
		var indexStart = list.indexOfFirstItemVisible();
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

			display.drawText
			(
				text, this.fontHeightInPixels, drawPos, display.colorFore, display.colorBack, list.isHighlighted
			);
			
			itemPosY += itemSizeY;
		}
		
		this.scrollbar.draw();
	}
}
