
class ControlList
{
	constructor(name, pos, size, items, bindingForItemText, fontHeightInPixels, bindingForItemSelected, bindingForItemValue, bindingForIsEnabled, confirm)
	{
		this.name = name;
		this.pos = pos;
		this.size = size;
		this._items = items;
		this.bindingForItemText = bindingForItemText;
		this.fontHeightInPixels = fontHeightInPixels;
		this.bindingForItemSelected = bindingForItemSelected;
		this.bindingForItemValue = bindingForItemValue;
		this.bindingForIsEnabled = bindingForIsEnabled;
		this.confirm = confirm;

		this.itemSpacing = 1.2 * this.fontHeightInPixels; // hack

		this.isHighlighted = false;

		var scrollbarWidth = this.itemSpacing;
		this.scrollbar = new ControlScrollbar
		(
			new Coords(this.size.x - scrollbarWidth, 0), // pos
			new Coords(scrollbarWidth, this.size.y), // size
			this.fontHeightInPixels,
			this.itemSpacing, // itemHeight
			this._items,
			0 // value
		);

		// Helper variables.
		this._drawPos = new Coords();
		this._drawLoc = new Location(this._drawPos);
		this._mouseClickPos = new Coords();
	}

	static fromPosSizeAndItems(pos, size, items)
	{
		var returnValue = new ControlList
		(
			"", // name,
			pos,
			size,
			items,
			new DataBinding(), // bindingForItemText,
			10, // fontHeightInPixels,
			null, // bindingForItemSelected,
			null, // bindingForItemValue,
			true // bindingForIsEnabled
		);

		return returnValue;
	};

	static fromPosSizeItemsAndBindingForItemText(pos, size, items, bindingForItemText)
	{
		var returnValue = new ControlList
		(
			"", // name,
			pos,
			size,
			items,
			bindingForItemText,
			10, // fontHeightInPixels,
			null, // bindingForItemSelected,
			null, // bindingForItemValue,
			true // bindingForIsEnabled
		);

		return returnValue;
	};

	actionHandle(actionNameToHandle)
	{
		var wasActionHandled = false;
		var controlActionNames = ControlActionNames.Instances();
		if (actionNameToHandle == controlActionNames.ControlIncrement)
		{
			this.itemSelectedNextInDirection(1);
			wasActionHandled = true;
		}
		else if (actionNameToHandle == controlActionNames.ControlDecrement)
		{
			this.itemSelectedNextInDirection(-1);
			wasActionHandled = true;
		}
		else if (actionNameToHandle == controlActionNames.ControlConfirm)
		{
			if (this.confirm != null)
			{
				this.confirm();
				wasActionHandled = true;
			}
		}
		return wasActionHandled;
	};

	focusGain()
	{
		this.isHighlighted = true;
	};

	focusLose()
	{
		this.isHighlighted = false;
	};

	indexOfFirstItemVisible()
	{
		return this.scrollbar.sliderPosInItems();
	};

	indexOfItemSelected(valueToSet)
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
	};

	indexOfLastItemVisible()
	{
		return this.indexOfFirstItemVisible() + Math.floor(this.scrollbar.windowSizeInItems) - 1;
	};

	isEnabled()
	{
		return (this.bindingForIsEnabled == null ? true : this.bindingForIsEnabled.get());
	};

	itemSelected(itemToSet)
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
				var valueToSet = this.bindingForItemValue.contextSet
				(
					this._itemSelected
				).get();
				this.bindingForItemSelected.set(valueToSet);
			}
		}

		return returnValue;
	};

	itemSelectedNextInDirection(direction)
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
	};

	items()
	{
		return (this._items.get == null ? this._items : this._items.get());
	};

	mouseClick(clickPos)
	{
		clickPos = this._mouseClickPos.overwriteWith(clickPos);

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

			var items = this.items();
			if (indexOfItemClicked < items.length)
			{
				this.indexOfItemSelected(indexOfItemClicked);
			}
		}

		return true; // wasActionHandled
	};

	scalePosAndSize(scaleFactor)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
		this.itemSpacing *= scaleFactor.y;
		this.scrollbar.scalePosAndSize(scaleFactor);
	};

	style(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	};

	// drawable

	draw(universe, display, drawLoc)
	{
		drawLoc = this._drawLoc.overwriteWith(drawLoc);
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);

		var style = this.style(universe);
		var colorFore = (this.isHighlighted ? style.colorFill : style.colorBorder);
		var colorBack = (this.isHighlighted ? style.colorBorder : style.colorFill);

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
				);
			}

			var text = this.bindingForItemText.contextSet
			(
				item
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
	};
}
