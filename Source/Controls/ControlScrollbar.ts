
class ControlScrollbar implements Control
{
	pos: Coords;
	size: Coords;
	fontHeightInPixels: number;
	itemHeight: number;
	_items: any;
	_sliderPosInItems: number;

	name: string;
	buttonScrollDown: ControlButton;
	buttonScrollUp: ControlButton;
	handleSize: Coords;
	isHighlighted: boolean;
	parent: Control;
	styleName: string;
	windowSizeInItems: number;

	_drawPos: Coords;

	constructor
	(
		pos: Coords, size: Coords, fontHeightInPixels: number,
		itemHeight: number, items: any, sliderPosInItems: number
	)
	{
		this.pos = pos;
		this.size = size;
		this.fontHeightInPixels = fontHeightInPixels;
		this.itemHeight = itemHeight;
		this._items = items;
		this._sliderPosInItems = sliderPosInItems;

		this.windowSizeInItems = Math.floor(this.size.y / itemHeight);

		this.handleSize = new Coords(this.size.x, this.size.x, 0);

		this.buttonScrollUp = new ControlButton
		(
			null, // name
			new Coords(0, 0, 0), // pos
			this.handleSize.clone(), // size
			"-", // text
			this.fontHeightInPixels,
			true, // hasBorder
			true, // isEnabled
			this.scrollUp, // click
			null, null
		);

		this.buttonScrollDown = new ControlButton
		(
			null, // name
			new Coords(0, this.size.y - this.handleSize.y, 0), // pos
			this.handleSize.clone(), // size
			"+", // text
			this.fontHeightInPixels,
			true, // hasBorder
			true, // isEnabled
			this.scrollDown, // click
			null, null
		);

		// Helper variables.
		this._drawPos = new Coords(0, 0, 0);
	}

	actionHandle(actionNameToHandle: string, universe: Universe)
	{
		return true;
	};

	actionToInputsMappings(): ActionToInputsMapping[]
	{
		return null; // todo
	}

	childWithFocus(): Control
	{
		return null; // todo
	}

	focusGain() {}

	focusLose() {}

	isEnabled()
	{
		return true;
	}

	isVisible()
	{
		return this.windowSizeInItems < this.items().length
	}

	items()
	{
		return (this._items.get == null ? this._items : this._items.get());
	};

	mouseClick(pos: Coords): boolean
	{
		return false;
	}

	mouseEnter() {}

	mouseExit() {}

	mouseMove(pos: Coords) {}

	scalePosAndSize(scaleFactor: Coords)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.handleSize.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
		this.buttonScrollUp.scalePosAndSize(scaleFactor);
		this.buttonScrollDown.scalePosAndSize(scaleFactor);
	};

	scrollDown()
	{
		var sliderPosInItems = NumberHelper.trimToRangeMinMax
		(
			this.sliderPosInItems() + 1, 0, this.sliderMaxInItems()
		);

		this._sliderPosInItems = sliderPosInItems;
	};

	scrollUp()
	{
		var sliderPosInItems = NumberHelper.trimToRangeMinMax
		(
			this.sliderPosInItems() - 1, 0, this.sliderMaxInItems()
		);

		this._sliderPosInItems = sliderPosInItems;
	};

	slideSizeInPixels()
	{
		var slideSizeInPixels = new Coords
		(
			this.handleSize.x,
			this.size.y - 2 * this.handleSize.y,
			0
		);

		return slideSizeInPixels;
	};

	sliderPosInItems()
	{
		return this._sliderPosInItems;
	};

	sliderMaxInItems()
	{
		return this.items().length - Math.floor(this.windowSizeInItems);
	};

	sliderPosInPixels()
	{
		var sliderPosInPixels = new Coords
		(
			this.size.x - this.handleSize.x,
			this.handleSize.y
				+ this.sliderPosInItems()
				* this.slideSizeInPixels().y
				/ this.items().length,
			0
		);

		return sliderPosInPixels;
	};

	sliderSizeInPixels()
	{
		var sliderSizeInPixels = this.slideSizeInPixels().multiply
		(
			new Coords(1, this.windowSizeInItems / this.items().length, 0)
		);

		return sliderSizeInPixels;
	};

	style(universe: Universe)
	{
		return universe.controlBuilder.stylesByName.get(this.styleName == null ? "Default" : this.styleName);
	};

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition)
	{
		if (this.isVisible())
		{
			var style = this.style(universe);
			var colorFore = (this.isHighlighted ? style.colorFill : style.colorBorder);
			var colorBack = (this.isHighlighted ? style.colorBorder : style.colorFill);

			var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
			display.drawRectangle(drawPos, this.size, colorFore, null, null);

			drawLoc.pos.add(this.pos);
			this.buttonScrollDown.draw(universe, display, drawLoc);
			this.buttonScrollUp.draw(universe, display, drawLoc);

			var sliderPosInPixels = this.sliderPosInPixels().add(drawPos);
			var sliderSizeInPixels = this.sliderSizeInPixels();

			display.drawRectangle
			(
				sliderPosInPixels,
				sliderSizeInPixels,
				colorBack,
				colorFore,
				null
			);
		}
	};
}
