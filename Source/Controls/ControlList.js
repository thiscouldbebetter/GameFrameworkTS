
function ControlList(name, pos, size, items, bindingExpressionForItemText, fontHeightInPixels, bindingForItemSelected, bindingExpressionForItemValue)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this._items = items;
	this.bindingExpressionForItemText = bindingExpressionForItemText;
	this.fontHeightInPixels = fontHeightInPixels;
	this.bindingForItemSelected = bindingForItemSelected;
	this.bindingExpressionForItemValue = bindingExpressionForItemValue;

	this.itemSpacing = 1.2 * this.fontHeightInPixels; // hack

	this.isHighlighted = false;

	var scrollbarWidth = this.itemSpacing;
	this.scrollbar = new ControlScrollbar
	(
		new Coords(this.size.x - scrollbarWidth, 0), // pos
		new Coords(scrollbarWidth, this.size.y), // size
		this.fontHeightInPixels,
		this.itemSpacing,
		this._items,
		0 // value
	);

	// Helper variables.
	this.drawPos = new Coords();
	this.drawLoc = new Location(this.drawPos);
	this.mouseClickPos = new Coords();
}

{
	ControlList.prototype.actionHandle = function(universe, actionNameToHandle)
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
		return this.scrollbar.sliderPosInItems();
	}

	ControlList.prototype.indexOfItemSelected = function(valueToSet)
	{
		var returnValue = valueToSet;
		var items = this.items();
		if (valueToSet == null)
		{
			returnValue = items.indexOf(this.itemSelected());
			if (returnValue == -1)
			{
				returnValue = null;
			}
		}
		else
		{
			var itemToSelect = items[valueToSet];
			this.itemSelected(itemToSelect);
		}
		return returnValue;
	}

	ControlList.prototype.indexOfLastItemVisible = function()
	{
		return this.indexOfFirstItemVisible() + Math.floor(this.scrollbar.windowSizeInItems) - 1;
	}

	ControlList.prototype.isEnabled = function()
	{
		return true;
	}

	ControlList.prototype.itemSelected = function(itemToSet)
	{
		var returnValue = itemToSet;

		if (itemToSet == null)
		{
			if (this._bindingForItemSelected == null)
			{
				returnValue = this._itemSelected;
			}
			else
			{
				returnValue = (this.bindingForItemSelected.get == null ? this._itemSelected : this.bindingForItemSelected.get() );
			}
		}
		else
		{
			this._itemSelected = itemToSet;

			if (this.bindingForItemSelected != null)
			{
				var valueToSet = new DataBinding
				(
					this._itemSelected, this.bindingExpressionForItemValue
				).get();
				this.bindingForItemSelected.set(valueToSet);
			}
		}

		return returnValue;
	}

	ControlList.prototype.itemSelectedNextInDirection = function(direction)
	{
		var items = this.items();
		var numberOfItems = items.length;

		var itemSelected = this.itemSelected();
		var indexOfItemSelected = this.indexOfItemSelected();

		if (indexOfItemSelected == null)
		{
			if (numberOfItems > 0)
			{
				if (direction == 1)
				{
					indexOfItemSelected = 0;
				}
				else // if (direction == -1)
				{
					indexOfItemSelected = numberOfItems - 1;
				}
			}
		}
		else
		{
			indexOfItemSelected =
			(
				indexOfItemSelected + direction
			).trimToRangeMinMax(0, numberOfItems - 1);
		}

		var itemToSelect = (indexOfItemSelected == null ? null : items[indexOfItemSelected]);
		this.itemSelected(itemToSelect);

		var indexOfFirstItemVisible = this.indexOfFirstItemVisible();
		var indexOfLastItemVisible = this.indexOfLastItemVisible();

		var indexOfItemSelected = this.indexOfItemSelected();
		if (indexOfItemSelected < indexOfFirstItemVisible)
		{
			this.scrollbar.scrollUp();
		}
		else if (indexOfItemSelected > indexOfLastItemVisible)
		{
			this.scrollbar.scrollDown();
		}

		var returnValue = this.itemSelected();
		return returnValue;
	}

	ControlList.prototype.items = function()
	{
		return (this._items.get == null ? this._items : this._items.get());
	}

	ControlList.prototype.mouseClick = function(universe, clickPos)
	{
		clickPos = this.mouseClickPos.overwriteWith(clickPos);

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
				var clickPosRelativeToSlideInPixels = clickPos.subtract
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
				this.indexOfItemSelected(indexOfItemClicked);
			}
		}
	}

	ControlList.prototype.style = function(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	}

	// drawable

	ControlList.prototype.draw = function(universe, display, drawLoc)
	{
		var drawPos = this.drawPos.overwriteWith(drawLoc.pos).add(this.pos);

		var style = this.style(universe);
		var colorFore = (this.isHighlighted == true ? style.colorFill : style.colorBorder);
		var colorBack = (this.isHighlighted == true ? style.colorBorder : style.colorFill);

		display.drawRectangle
		(
			drawPos,
			this.size,
			colorBack, // fill
			style.colorBorder, // border
			false // areColorsReversed
		);

		var itemSizeY = this.itemSpacing;
		var textMarginLeft = 2;
		var itemPosY = drawPos.y;

		var items = this.items();

		if (items == null)
		{
			return;
		}

		var numberOfItemsVisible = Math.floor(this.size.y / itemSizeY);
		var indexStart = this.indexOfFirstItemVisible();
		var indexEnd = indexStart + numberOfItemsVisible - 1;
		if (indexEnd >= items.length)
		{
			indexEnd = items.length - 1;
		}

		var itemSelected = this.itemSelected();

		for (var i = indexStart; i <= indexEnd; i++)
		{
			var item = items[i];

			if (item == itemSelected)
			{
				display.drawRectangle
				(
					// pos
					new Coords
					(
						drawPos.x,
						itemPosY
					),
					// size
					new Coords
					(
						this.size.x,
						itemSizeY
					),
					colorFore // colorFill
				)
			}

			var text = new DataBinding
			(
				item, this.bindingExpressionForItemText
			).get();

			var drawPos2 = new Coords(drawPos.x + textMarginLeft, itemPosY);

			display.drawText
			(
				text,
				this.fontHeightInPixels,
				drawPos2,
				colorFore,
				colorBack,
				(i == this.indexOfItemSelected()), // areColorsReversed
				false, // isCentered
				this.size.x // widthMaxInPixels
			);

			itemPosY += itemSizeY;
		}

		this.scrollbar.draw(universe, display, drawLoc);
	}
}
