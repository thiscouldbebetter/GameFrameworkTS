
class ControlList implements Control
{
	name: string;
	pos: Coords;
	size: Coords;
	_items: any;
	bindingForItemText: DataBinding<any, string>;
	fontHeightInPixels: number;
	bindingForItemSelected: DataBinding<any, any>;
	bindingForItemValue: DataBinding<any, any>;
	bindingForIsEnabled: DataBinding<any, boolean>;
	confirm: (u: Universe) => void;
	widthInItems: number;

	isHighlighted: boolean;
	itemSpacing: Coords;
	parent: Control;
	scrollbar: ControlScrollbar;
	styleName: string;

	_drawLoc: Disposition;
	_drawPos: Coords;
	_itemSelected: any;
	_mouseClickPos: Coords;

	constructor
	(
		name: string, pos: Coords, size: Coords, items: DataBinding<any, any[]>,
		bindingForItemText: DataBinding<any, string>, fontHeightInPixels: number,
		bindingForItemSelected: DataBinding<any, any>, bindingForItemValue: DataBinding<any, any>,
		bindingForIsEnabled: DataBinding<any, boolean>, confirm: (u: Universe) => void,
		widthInItems: number
	)
	{
		this.name = name;
		this.pos = pos;
		this.size = size;
		this._items = items;
		this.bindingForItemText = bindingForItemText;
		this.fontHeightInPixels = fontHeightInPixels;
		this.bindingForItemSelected = bindingForItemSelected;
		this.bindingForItemValue = bindingForItemValue;
		this.bindingForIsEnabled = bindingForIsEnabled || new DataBinding(true, null, null);
		this.confirm = confirm;
		this.widthInItems = widthInItems || 1;

		var itemSpacingY = 1.2 * this.fontHeightInPixels; // hack
		var scrollbarWidth = itemSpacingY;

		this.itemSpacing = new Coords
		(
			(this.size.x - scrollbarWidth) / this.widthInItems,
			itemSpacingY, 0
		);

		this.isHighlighted = false;

		this.scrollbar = new ControlScrollbar
		(
			new Coords(this.size.x - scrollbarWidth, 0, 0), // pos
			new Coords(scrollbarWidth, this.size.y, 0), // size
			this.fontHeightInPixels,
			this.itemSpacing.y, // itemHeight
			this._items,
			0 // value
		);

		// Helper variables.
		this._drawPos = new Coords(0, 0, 0);
		this._drawLoc = new Disposition(this._drawPos, null, null);
		this._mouseClickPos = new Coords(0, 0, 0);
	}

	static fromPosSizeAndItems(pos: Coords, size: Coords, items: DataBinding<any, any[]>)
	{
		var returnValue = new ControlList
		(
			"", // name,
			pos,
			size,
			items,
			new DataBinding(null, null, null), // bindingForItemText,
			10, // fontHeightInPixels,
			null, // bindingForItemSelected,
			null, // bindingForItemValue,
			new DataBinding(true, null, null), // bindingForIsEnabled
			null, null
		);

		return returnValue;
	};

	static fromPosSizeItemsAndBindingForItemText
	(
		pos: Coords, size: Coords, items: DataBinding<any, any[]>,
		bindingForItemText: DataBinding<any, string>
	)
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
			new DataBinding(true, null, null), // bindingForIsEnabled
			null, null
		);

		return returnValue;
	};

	actionHandle(actionNameToHandle: string, universe: Universe)
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
				this.confirm(universe);
				wasActionHandled = true;
			}
		}
		return wasActionHandled;
	};

	actionToInputsMappings(): ActionToInputsMapping[]
	{
		return null; // todo
	}

	childWithFocus(): Control
	{
		return null; // todo
	}

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
		return this.indexOfFirstRowVisible() * this.widthInItems;
	};

	indexOfFirstRowVisible()
	{
		return this.scrollbar.sliderPosInItems();
	};

	indexOfItemSelected(valueToSet: number)
	{
		var returnValue = valueToSet;
		var items = this.items();
		if (valueToSet == null)
		{
			returnValue = items.indexOf(this.itemSelected(null));
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
		return this.indexOfLastRowVisible() * this.widthInItems;
	};

	indexOfLastRowVisible()
	{
		var rowCountVisible = Math.floor(this.scrollbar.windowSizeInItems) - 1;
		var returnValue = this.indexOfFirstRowVisible() + rowCountVisible;
		return returnValue;
	};

	isEnabled()
	{
		return (this.bindingForIsEnabled == null ? true : this.bindingForIsEnabled.get());
	};

	itemSelected(itemToSet: any)
	{
		var returnValue = itemToSet;

		if (itemToSet == null)
		{
			if (this.bindingForItemSelected == null)
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

	itemSelectedNextInDirection(direction: number)
	{
		var items = this.items();
		var numberOfItems = items.length;

		var indexOfItemSelected = this.indexOfItemSelected(null);

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
			indexOfItemSelected = NumberHelper.trimToRangeMinMax
			(
				indexOfItemSelected + direction, 0, numberOfItems - 1
			);
		}

		var itemToSelect = (indexOfItemSelected == null ? null : items[indexOfItemSelected]);
		this.itemSelected(itemToSelect);

		var indexOfFirstItemVisible = this.indexOfFirstItemVisible();
		var indexOfLastItemVisible = this.indexOfLastItemVisible();

		var indexOfItemSelected = this.indexOfItemSelected(null);
		if (indexOfItemSelected < indexOfFirstItemVisible)
		{
			this.scrollbar.scrollUp();
		}
		else if (indexOfItemSelected > indexOfLastItemVisible)
		{
			this.scrollbar.scrollDown();
		}

		var returnValue = this.itemSelected(null);
		return returnValue;
	};

	items()
	{
		return (this._items.get == null ? this._items : this._items.get());
	};

	mouseClick(clickPos: Coords)
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
				// todo

				/*
				var clickPosRelativeToSlideInPixels = clickPos.subtract
				(
					this.scrollbar.pos
				).subtract
				(
					new Coords(0, this.scrollbar.handleSize.y, 0)
				);
				*/
			}
		}
		else
		{
			var clickOffsetInPixels = clickPos.clone().subtract(this.pos);
			var clickOffsetInItems = clickOffsetInPixels.clone().divide(this.itemSpacing).floor();
			var rowOfItemClicked =
				this.indexOfFirstRowVisible() + clickOffsetInItems.y;
			var indexOfItemClicked =
				rowOfItemClicked * this.widthInItems + clickOffsetInItems.x;

			var items = this.items();
			if (indexOfItemClicked < items.length)
			{
				this.indexOfItemSelected(indexOfItemClicked);
			}
		}

		return true; // wasActionHandled
	};

	mouseEnter() {}

	mouseExit() {}

	mouseMove(movePos: Coords) {}

	scalePosAndSize(scaleFactor: Coords)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
		this.itemSpacing.multiply(scaleFactor);
		this.scrollbar.scalePosAndSize(scaleFactor);
	};

	style(universe: Universe)
	{
		return universe.controlBuilder.stylesByName.get(this.styleName == null ? "Default" : this.styleName);
	};

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition)
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

		var textMarginLeft = 2;

		var items = this.items();

		if (items == null)
		{
			return;
		}

		var indexStart = this.indexOfFirstItemVisible();
		var indexEnd = this.indexOfLastItemVisible();
		if (indexEnd >= items.length)
		{
			indexEnd = items.length - 1;
		}

		var itemSelected = this.itemSelected(null);

		var drawPos2 = new Coords(0, 0, 0);

		for (var i = indexStart; i <= indexEnd; i++)
		{
			var item = items[i];

			var iOffset = i - indexStart;
			var offsetInItems = new Coords
			(
				iOffset % this.widthInItems,
				Math.floor(iOffset / this.widthInItems),
				0
			);

			drawPos2.overwriteWith
			(
				this.itemSpacing
			).multiply
			(
				offsetInItems
			).add
			(
				drawPos
			).addDimensions
			(
				textMarginLeft, 0, 0
			);

			if (item == itemSelected)
			{
				display.drawRectangle
				(
					drawPos2,
					this.itemSpacing,
					colorFore, // colorFill
					null, null
				);
			}

			var text = this.bindingForItemText.contextSet
			(
				item
			).get();

			display.drawText
			(
				text,
				this.fontHeightInPixels,
				drawPos2,
				colorFore,
				colorBack,
				(i == this.indexOfItemSelected(null)), // areColorsReversed
				false, // isCentered
				this.size.x // widthMaxInPixels
			);
		}

		this.scrollbar.draw(universe, display, drawLoc);
	};
}
