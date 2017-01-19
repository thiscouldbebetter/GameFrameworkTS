
function ControlScrollbar(pos, size, fontHeightInPixels, itemHeight, dataBindingForItems, sliderPosInItems)
{
	this.pos = pos;
	this.size = size;
	this.fontHeightInPixels = fontHeightInPixels;
	this.itemHeight = itemHeight;
	this.dataBindingForItems = dataBindingForItems;
	this.sliderPosInItems = sliderPosInItems;
	
	this.windowSizeInItems = Math.floor(this.size.y / itemHeight);
	
	this.handleSize = new Coords(this.size.x, this.size.x);
		
	this.buttonScrollUp = new ControlButton
	(
		null, // name
		this.pos.clone(), // pos
		this.handleSize, // size
		"-", // text
		this.fontHeightInPixels,
		true, // hasBorder
		this.scrollUp // click
	);
	
	this.buttonScrollDown = new ControlButton
	(
		null, // name
		this.pos.clone().add(new Coords(0, this.size.y - this.handleSize.y)), // pos
		this.handleSize, // size
		"+", // text
		this.fontHeightInPixels,
		true, // hasBorder
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
		return this.dataBindingForItems.get();
	}
	
	ControlScrollbar.prototype.mouseClick = function(clickPos)
	{
		// todo
	}
	
	ControlScrollbar.prototype.scrollDown = function()
	{
		this.sliderPosInItems = NumberHelper.trimValueToRangeMinMax
		(
			this.sliderPosInItems + 1, 0, this.sliderMaxInItems()
		);
	}
	
	ControlScrollbar.prototype.scrollUp = function()
	{
		this.sliderPosInItems = NumberHelper.trimValueToRangeMinMax
		(
			this.sliderPosInItems - 1, 0, this.sliderMaxInItems()
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
		var sliderPosInPixels = this.pos.clone().add
		(
			new Coords
			(
				this.size.x - this.handleSize.x, 
				this.handleSize.y 
					+ this.sliderPosInItems 
					* this.slideSizeInPixels().y 
					/ this.items().length
			)
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

	
	// drawable
	
	ControlScrollbar.prototype.draw = function()
	{
		var numberOfItems = this.items().length;

		if (this.windowSizeInItems < numberOfItems)
		{
			var display = Globals.Instance.display;
			
			display.drawRectangle(this.pos, this.size, display.colorFore, null);

			this.buttonScrollDown.draw();
			this.buttonScrollUp.draw();
					
			var sliderPosInPixels = this.sliderPosInPixels();
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
