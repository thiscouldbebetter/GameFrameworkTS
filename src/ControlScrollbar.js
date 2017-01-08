
function ControlScrollbar(pos, size, itemHeight, dataBindingForItems, sliderPosInItems)
{
	this.pos = pos;
	this.size = size;
	this.itemHeight = itemHeight;
	this.dataBindingForItems = dataBindingForItems;
	this.sliderPosInItems = sliderPosInItems;
	
	this.windowSizeInItems = this.size.y / itemHeight;
	
	this.handleSize = new Coords(this.size.x, this.size.x);
		
	this.buttonScrollUp = new ControlButton
	(
		null, // name
		this.pos.clone(), // pos
		this.handleSize, // size
		"-", // text
		this.scrollUp // click
	);
	
	this.buttonScrollDown = new ControlButton
	(
		null, // name
		this.pos.clone().add(new Coords(0, this.size.y - this.handleSize.y)), // pos
		this.handleSize, // size
		"+", // text
		this.scrollDown // click
	);
}

{
	ControlScrollbar.prototype.inputHandle = function(inputToHandle)
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
					/ this.windowSizeInItems
			)
		);
		
		return sliderPosInPixels;		
	}
	
	ControlScrollbar.prototype.sliderSizeInPixels = function()
	{
		var sliderSizeInPixels = this.slideSizeInPixels().divide
		(
			new Coords(1, this.sliderMaxInItems())
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
