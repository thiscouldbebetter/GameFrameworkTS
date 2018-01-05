
function ControlScrollbar(pos, size, fontHeightInPixels, itemHeight, items, sliderPosInItems)
{
	this.pos = pos;
	this.size = size;
	this.fontHeightInPixels = fontHeightInPixels;
	this.itemHeight = itemHeight;
	this._items = items;
	this._sliderPosInItems = sliderPosInItems;

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

	// Helper variables.
	this._drawPos = new Coords();
}

{
	ControlScrollbar.prototype.actionHandle = function(actionNameToHandle)
	{
		return true;
	}

	ControlScrollbar.prototype.items = function()
	{
		return (this._items.get == null ? this._items : this._items.get());
	}

	ControlScrollbar.prototype.mouseClick = function(universe, clickPos)
	{
		// todo
	}

	ControlScrollbar.prototype.scrollDown = function()
	{
		var sliderPosInItems = 
		(
			this.sliderPosInItems() + 1
		).trimToRangeMinMax
		(
			0, this.sliderMaxInItems()
		);

		this._sliderPosInItems = sliderPosInItems;
	}

	ControlScrollbar.prototype.scrollUp = function()
	{
		var sliderPosInItems = 
		(
			this.sliderPosInItems() - 1
		).trimToRangeMinMax
		(
			0, this.sliderMaxInItems()
		);

		this._sliderPosInItems = sliderPosInItems;
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

	ControlScrollbar.prototype.sliderPosInItems = function()
	{
		return this._sliderPosInItems;
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
				+ this.sliderPosInItems()
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

	ControlScrollbar.prototype.style = function(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	}

	// drawable

	ControlScrollbar.prototype.draw = function(universe, display, drawLoc)
	{
		var numberOfItems = this.items().length;

		if (this.windowSizeInItems < numberOfItems)
		{
			var style = this.style(universe);
			var colorFore = (this.isHighlighted == true ? style.colorFill : style.colorBorder);
			var colorBack = (this.isHighlighted == true ? style.colorBorder : style.colorFill);

			var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
			display.drawRectangle(drawPos, this.size, colorFore, null);

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
				colorFore
			);
		}
	}
}
