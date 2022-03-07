
namespace ThisCouldBeBetter.GameFramework
{

export class ControlList<TContext, TItem, TValue> extends ControlBase
{
	_items: DataBinding<TContext, TItem[]>;
	bindingForItemText: DataBinding<TItem, string>;
	bindingForItemSelected: DataBinding<TContext, TItem>;
	bindingForItemValue: DataBinding<TItem, TValue>;
	bindingForIsEnabled: DataBinding<TContext, boolean>;
	_confirm: (u: Universe) => void;
	widthInItems: number;

	isHighlighted: boolean;
	_itemSize: Coords;
	parent: ControlBase;
	scrollbar: ControlScrollbar<TContext, TItem>;

	_drawLoc: Disposition;
	_drawPos: Coords;
	_itemSelected: TItem;
	_mouseClickPos: Coords;

	constructor
	(
		name: string,
		pos: Coords,
		size: Coords,
		items: DataBinding<TContext, TItem[]>,
		bindingForItemText: DataBinding<TItem, string>,
		fontNameAndHeight: FontNameAndHeight,
		bindingForItemSelected: DataBinding<TContext, TItem>,
		bindingForItemValue: DataBinding<TItem, TValue>,
		bindingForIsEnabled: DataBinding<TContext, boolean>,
		confirm: (u: Universe) => void,
		widthInItems: number
	)
	{
		super(name, pos, size, fontNameAndHeight);
		this._items = items;
		this.bindingForItemText = bindingForItemText;
		this.bindingForItemSelected = bindingForItemSelected;
		this.bindingForItemValue = bindingForItemValue;
		this.bindingForIsEnabled =
			bindingForIsEnabled
			|| DataBinding.fromTrueWithContext<TContext>(null);
		this._confirm = confirm;
		this.widthInItems = widthInItems || 1;

		var itemSizeY = 1.2 * this.fontNameAndHeight.heightInPixels; // hack
		this._itemSize = Coords.fromXY(size.x, itemSizeY);
		var scrollbarWidth = itemSizeY;

		this.isHighlighted = false;

		this.scrollbar = new ControlScrollbar
		(
			Coords.fromXY(this.size.x - scrollbarWidth, 0), // pos
			Coords.fromXY(scrollbarWidth, this.size.y), // size
			this.fontNameAndHeight,
			itemSizeY, // itemHeight
			this._items,
			0 // value
		);

		// Helper variables.
		this._drawPos = Coords.create();
		this._drawLoc = Disposition.fromPos(this._drawPos);
		this._mouseClickPos = Coords.create();
	}

	static fromPosSizeItemsAndBindingForItemText<TContext, TItem, TValue>
	(
		pos: Coords,
		size: Coords,
		items: DataBinding<TContext, TItem[]>,
		bindingForItemText: DataBinding<TItem, string>
	)
	{
		var returnValue = new ControlList<TContext, TItem, TValue>
		(
			"", // name,
			pos,
			size,
			items,
			bindingForItemText,
			FontNameAndHeight.default(),
			null, // bindingForItemSelected,
			null, // bindingForItemValue,
			DataBinding.fromTrue(), // isEnabled
			null, // confirm
			null // widthInItems
		);

		return returnValue;
	}

	static fromPosSizeItemsAndBindingsForItemTextAndSelected<TContext, TItem, TValue>
	(
		pos: Coords,
		size: Coords,
		items: DataBinding<TContext, TItem[]>,
		bindingForItemText: DataBinding<TItem, string>,
		bindingForItemSelected: DataBinding<TContext, TItem>
	)
	{
		var returnValue = new ControlList<TContext, TItem, TValue>
		(
			"", // name,
			pos,
			size,
			items,
			bindingForItemText,
			FontNameAndHeight.default(),
			bindingForItemSelected,
			null, // bindingForItemValue,
			DataBinding.fromTrue(), // isEnabled
			null, // confirm
			null // widthInItems
		);

		return returnValue;
	}

	static from6<TContext, TItem, TValue>
	(
		name: string,
		pos: Coords,
		size: Coords,
		items: DataBinding<TContext, TItem[]>,
		bindingForItemText: DataBinding<TItem, string>,
		fontNameAndHeight: FontNameAndHeight
	): ControlList<TContext, TItem, TValue>
	{
		return new ControlList<TContext, TItem, TValue>
		(
			name, pos, size, items, bindingForItemText, fontNameAndHeight,
			null, null, null, null, null
		);
	}

	static from7<TContext, TItem, TValue>
	(
		name: string,
		pos: Coords,
		size: Coords,
		items: DataBinding<TContext, TItem[]>,
		bindingForItemText: DataBinding<TItem, string>,
		fontNameAndHeight: FontNameAndHeight,
		bindingForItemSelected: DataBinding<TContext, TItem>,
	): ControlList<TContext, TItem, TValue>
	{
		return new ControlList<TContext, TItem, TValue>
		(
			name, pos, size, items, bindingForItemText, fontNameAndHeight,
			bindingForItemSelected, null, null, null, null
		);
	}

	static from8<TContext, TItem, TValue>
	(
		name: string,
		pos: Coords,
		size: Coords,
		items: DataBinding<TContext, TItem[]>,
		bindingForItemText: DataBinding<TItem, string>,
		fontNameAndHeight: FontNameAndHeight,
		bindingForItemSelected: DataBinding<TContext, TItem>,
		bindingForItemValue: DataBinding<TItem, TValue>,
	): ControlList<TContext, TItem, TValue>
	{
		return new ControlList<TContext, TItem, TValue>
		(
			name, pos, size, items, bindingForItemText, fontNameAndHeight,
			bindingForItemSelected, bindingForItemValue, null, null, null
		);
	}

	static from9<TContext, TItem, TValue>
	(
		name: string,
		pos: Coords,
		size: Coords,
		items: DataBinding<TContext, TItem[]>,
		bindingForItemText: DataBinding<TItem, string>,
		fontNameAndHeight: FontNameAndHeight,
		bindingForItemSelected: DataBinding<TContext, TItem>,
		bindingForItemValue: DataBinding<TItem, TValue>,
		bindingForIsEnabled: DataBinding<TContext, boolean>
	): ControlList<TContext, TItem, TValue>
	{
		return new ControlList<TContext, TItem, TValue>
		(
			name, pos, size, items, bindingForItemText, fontNameAndHeight,
			bindingForItemSelected, bindingForItemValue, bindingForIsEnabled,
			null, null
		);
	}

	static from10<TContext, TItem, TValue>
	(
		name: string,
		pos: Coords,
		size: Coords,
		items: DataBinding<TContext, TItem[]>,
		bindingForItemText: DataBinding<TItem, string>,
		fontNameAndHeight: FontNameAndHeight,
		bindingForItemSelected: DataBinding<TContext, TItem>,
		bindingForItemValue: DataBinding<TItem, TValue>,
		bindingForIsEnabled: DataBinding<TContext, boolean>,
		confirm: (u: Universe) => void
	): ControlList<TContext, TItem, TValue>
	{
		return new ControlList<TContext, TItem, TValue>
		(
			name, pos, size, items, bindingForItemText, fontNameAndHeight,
			bindingForItemSelected, bindingForItemValue, bindingForIsEnabled,
			confirm, null
		);
	}

	actionHandle(actionNameToHandle: string, universe: Universe): boolean
	{
		var wasActionHandled = false;
		var controlActionNames = ControlActionNames.Instances();

		if (this.isEnabled() == false)
		{
			wasActionHandled = true; // ?
		}
		else if (actionNameToHandle == controlActionNames.ControlIncrement)
		{
			this.itemSelectNextInDirection(1);
			wasActionHandled = true;
		}
		else if (actionNameToHandle == controlActionNames.ControlDecrement)
		{
			this.itemSelectNextInDirection(-1);
			wasActionHandled = true;
		}
		else if (actionNameToHandle == controlActionNames.ControlConfirm)
		{
			this.confirm(universe);
			wasActionHandled = true;
		}
		return wasActionHandled;
	}

	confirm(universe: Universe): void
	{
		if (this._confirm != null)
		{
			this._confirm(universe);
		}
	}

	indexOfFirstItemVisible(): number
	{
		return this.indexOfFirstRowVisible() * this.widthInItems;
	}

	indexOfFirstRowVisible(): number
	{
		return this.scrollbar.sliderPosInItems();
	}

	indexOfItemSelected(): number
	{
		var items = this.items();
		var returnValue = items.indexOf(this.itemSelected());
		if (returnValue == -1)
		{
			returnValue = null;
		}
		return returnValue;
	}

	indexOfLastItemVisible(): number
	{
		return this.indexOfLastRowVisible() * this.widthInItems;
	}

	indexOfLastRowVisible(): number
	{
		var rowCountVisible = Math.floor(this.scrollbar.windowSizeInItems) - 1;
		var returnValue = this.indexOfFirstRowVisible() + rowCountVisible;
		return returnValue;
	}

	isEnabled(): boolean
	{
		var returnValue =
		(
			this.bindingForIsEnabled == null
			? true
			: this.bindingForIsEnabled.get()
		);

		return returnValue;
	}

	itemSelect(itemToSet: TItem): TItem
	{
		var returnValue = itemToSet;

		this._itemSelected = itemToSet;

		if (this.bindingForItemSelected != null)
		{
			var valueToSet;
			if (this.bindingForItemValue == null)
			{
				valueToSet = this._itemSelected;
			}
			else
			{
				valueToSet = this.bindingForItemValue.contextSet
				(
					this._itemSelected
				).get();
				this.bindingForItemValue.set(valueToSet);
			}
			this.bindingForItemSelected.set(itemToSet);
		}

		return returnValue;
	}

	itemSelectByIndex(itemToSelectIndex: number): TItem
	{
		var items = this.items();
		var itemToSelect = items[itemToSelectIndex];
		var returnValue = this.itemSelect(itemToSelect);
		return returnValue;
	}

	itemSelected(): TItem
	{
		var returnValue;

		if (this.bindingForItemSelected == null)
		{
			returnValue = this._itemSelected;
		}
		else
		{
			returnValue =
			(
				this.bindingForItemSelected.get == null
				? this._itemSelected
				: this.bindingForItemSelected.get()
			);
		}

		return returnValue;
	}

	itemSelectNextInDirection(direction: number): TItem
	{
		var items = this.items();
		var numberOfItems = items.length;

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
			indexOfItemSelected = NumberHelper.trimToRangeMinMax
			(
				indexOfItemSelected + direction, 0, numberOfItems - 1
			);
		}

		var itemToSelect =
		(
			indexOfItemSelected == null ? null : items[indexOfItemSelected]
		);
		this.itemSelect(itemToSelect);

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

	itemSize(): Coords
	{
		var scrollbarWidthVisible =
			(this.scrollbar.isVisible() ? this.scrollbar.size.x : 0);

		return this._itemSize.overwriteWithDimensions
		(
			(this.size.x - scrollbarWidthVisible) / this.widthInItems,
			this._itemSize.y,
			0
		);
	}

	items(): TItem[]
	{
		return this._items.get();
	}

	mouseClick(clickPos: Coords): boolean
	{
		if (this.isEnabled() == false)
		{
			return true; // wasActionHandled
		}

		clickPos = this._mouseClickPos.overwriteWith(clickPos);

		var isClickPosInScrollbar =
			(clickPos.x - this.pos.x > this.size.x - this.scrollbar.handleSize.x);
		if (isClickPosInScrollbar)
		{
			if (clickPos.y - this.pos.y <= this.scrollbar.handleSize.y)
			{
				this.scrollbar.scrollUp();
			}
			else if
			(
				clickPos.y - this.pos.y
				>= this.scrollbar.size.y - this.scrollbar.handleSize.y
			)
			{
				this.scrollbar.scrollDown();
			}
		}
		else
		{
			var clickOffsetInPixels = clickPos.clone().subtract(this.pos);
			var clickOffsetInItems =
				clickOffsetInPixels.clone().divide(this.itemSize()).floor();
			var rowOfItemClicked =
				this.indexOfFirstRowVisible() + clickOffsetInItems.y;
			var indexOfItemClicked =
				rowOfItemClicked * this.widthInItems + clickOffsetInItems.x;

			var items = this.items();
			if (indexOfItemClicked < items.length)
			{
				var indexOfItemSelectedOld = this.indexOfItemSelected();
				if (indexOfItemClicked == indexOfItemSelectedOld)
				{
					if (this.confirm != null)
					{
						this.confirm(null); // todo
					}
				}
				else
				{
					this.itemSelectByIndex(indexOfItemClicked);
				}
			}
		}

		return true; // wasActionHandled
	}

	mouseEnter(): void {}

	mouseExit(): void {}

	mouseMove(movePos: Coords): boolean { return false; }

	scalePosAndSize(scaleFactor: Coords): ControlBase
	{
		super.scalePosAndSize(scaleFactor);

		this._itemSize.multiply(scaleFactor);
		this.scrollbar.scalePosAndSize(scaleFactor);

		return this;
	}

	// drawable

	draw
	(
		universe: Universe, display: Display, drawLoc: Disposition,
		style: ControlStyle
	): void
	{
		drawLoc = this._drawLoc.overwriteWith(drawLoc);
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);

		var style = style || this.style(universe);
		var colorFore = style.colorBorder();
		var colorBack = style.colorFill();

		style.drawBoxOfSizeAtPosWithColorsToDisplay
		(
			this.size, drawPos,
			colorBack, colorFore,
			this.isHighlighted,
			display
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

		var itemSelected = this.itemSelected();

		var drawPos2 = Coords.create();

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
				this.itemSize()
			).multiply
			(
				offsetInItems
			).add
			(
				drawPos
			)

			if (item == itemSelected)
			{
				style.drawBoxOfSizeAtPosWithColorsToDisplay
				(
					this.itemSize(),
					drawPos2,
					colorFore,
					colorBack,
					this.isHighlighted,
					display
				);
			}

			var text = this.bindingForItemText.contextSet
			(
				item
			).get();

			drawPos2.addDimensions
			(
				textMarginLeft, 0, 0
			);

			var isItemSelected = (i == this.indexOfItemSelected());;

			var areColorsReversed =
			(
				(this.isHighlighted && !isItemSelected)
				||
				(isItemSelected && !this.isHighlighted)
			);

			var textSizeMax = Coords.fromXY
			(
				this.itemSize().x, this.fontNameAndHeight.heightInPixels
			);

			display.drawText
			(
				text,
				this.fontNameAndHeight,
				drawPos2,
				(areColorsReversed ? colorBack : colorFore),
				(areColorsReversed ? colorFore : colorBack),
				false, // isCenteredHorizontally
				false, // isTextCenteredVertically
				textSizeMax
			);
		}

		this.scrollbar.draw(universe, display, drawLoc, style);
	}
}

}
