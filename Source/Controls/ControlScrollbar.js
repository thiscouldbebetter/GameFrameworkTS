
function ControlScrollbar(pos, size, fontHeightInPixels, itemHeight, items, sliderPosInItems)
{
	this.pos = pos;
	this.size = size;
	this.fontHeightInPixels = fontHeightInPixels;
	this.itemHeight = itemHeight;
	this._items = items;
	this.sliderPosInItems = sliderPosInItems;

	this.windowSizeInItems = Math.floor(this.size.y / itemHeight);

	this.handleSize = new Coords(this.size.x, this.size.x);

	this.buttonScrollUp = new ControlButton
	(
		null, // name
		new Coords(0, 0), // pos
		this.handleSize, // size
		"-", // text
		this.fontHeightInPixels,
		true, // hasBorder
		true, // isEnabled
		this.scrollUp // click
	);

	this.buttonScrollDown = new ControlButton
	(
		null, // name
		new Coords(0, this.size.y - this.handleSize.y), // pos
		this.handleSize, // size
		"+", // text
		this.fontHeightInPixels,
		true, // hasBorder
		true, // isEnabled
		this.scrollDown // click
	);
}

{
	ControlScrollbar.prototype.actionHandle = function(actionNameToHandle)
	{
		// todo
	}

	ControlScrollbar.prototype.items = function()
	{
		return (this._items.get == null ? this._items : this._items.get());
	}

	ControlScrollbar.prototype.mouseClick = function(clickPos)
	{
		// todo
	}

	ControlScrollbar.prototype.scrollDown = function()
	{
		this.sliderPosInItems = 
		(
			this.sliderPosInItems + 1
		).trimToRangeMinMax
		(
			0, this.sliderMaxInItems()
		);
	}

	ControlScrollbar.prototype.scrollUp = function()
	{
		this.sliderPosInItems = 
		(
			this.sliderPosInItems - 1
		).trimToRangeMinMax
		(
			0, this.sliderMaxInItems()
		);
	}

	ControlScrollbar.prototype.slideSizeInPixels = function()
	{
		var slideSizeInPixels = new Coords
		(
			this.handleSize.x,
			this.size.y - 2 * this.handleSize.y
		);

		return slideSizeInPixels;
	}

	ControlScrollbar.prototype.sliderMaxInItems = function()
	{
		return this.items().length - Math.floor(this.windowSizeInItems);
	}

	ControlScrollbar.prototype.sliderPosInPixels = function()
	{
		var sliderPosInPixels = new Coords
		(
			this.size.x - this.handleSize.x,
			this.handleSize.y
				+ this.sliderPosInItems
				* this.slideSizeInPixels().y
				/ this.items().length
		);

		return sliderPosInPixels;
	}

	ControlScrollbar.prototype.sliderSizeInPixels = function()
	{
		var sliderSizeInPixels = this.slideSizeInPixels().multiply
		(
			new Coords(1, this.windowSizeInItems / this.items().length)
		);

		return sliderSizeInPixels;
	}

	ControlScrollbar.prototype.style = function()
	{
		return Globals.Instance.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	}

	// drawable

	ControlScrollbar.prototype.drawToDisplayAtLoc = function(display, drawLoc)
	{
		var numberOfItems = this.items().length;

		if (this.windowSizeInItems < numberOfItems)
		{
			var drawPos = drawLoc.pos.add(this.pos);
			display.drawRectangle(drawPos, this.size, display.colorFore, null);

			this.buttonScrollDown.drawToDisplayAtLoc(display, drawLoc);
			this.buttonScrollUp.drawToDisplayAtLoc(display, drawLoc);

			var sliderPosInPixels = this.sliderPosInPixels().add(drawPos);
			var sliderSizeInPixels = this.sliderSizeInPixels();

			display.drawRectangle
			(
				sliderPosInPixels,
				sliderSizeInPixels,
				display.colorBack,
				display.colorFore
			);
		}
	}
}
