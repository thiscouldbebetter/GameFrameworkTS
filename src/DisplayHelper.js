
function DisplayHelper(viewSize, fontHeightInPixels)
{
	this.viewSize = viewSize;
	this.fontHeightInPixels = fontHeightInPixels;
}

{
	DisplayHelper.prototype.clear = function(colorBorder, colorBack)
	{
		this.drawRectangle
		(
			new Coords(0, 0), 
			this.viewSize, 
			(colorBorder == null ? "Gray" : colorBorder), 
			(colorBack == null ? "White" : colorBack)
		);
	}

	DisplayHelper.prototype.drawControlButton = function(control)
	{
		var pos = control.pos;
		var size = control.size;

		var colorsForeAndBack;

		if (control.isHighlighted == true)
		{
			colorsForeAndBack = ["White", "Gray"];
		}
		else
		{
			colorsForeAndBack = ["Gray", "White"];
		}

		this.drawRectangle
		(
			pos, size, 
			colorsForeAndBack[0], colorsForeAndBack[1]
		)

		var text = control.text;

		var textWidth = this.graphics.measureText(text).width;
		var textMarginLeft = (size.x - textWidth) / 2;
		var textHeight = this.fontHeightInPixels;
		var textMarginTop = (size.y - textHeight) / 2;

		this.graphics.fillStyle = colorsForeAndBack[0];
		this.graphics.fillText
		(
			text,
			pos.x + textMarginLeft,
			pos.y + textMarginTop + textHeight
		);
	}

	DisplayHelper.prototype.drawControlContainer = function(container)
	{
		var pos = container.pos
		var size = container.size;

		this.drawRectangle
		(
			pos, size, "Gray", "White"
		)

		var children = container.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.draw();
		}
	}

	DisplayHelper.prototype.drawControlImage = function(controlImage)
	{
		var pos = controlImage.pos
		var size = controlImage.size;

		this.drawRectangle
		(
			pos, size, "Gray", "White"
		)

		this.graphics.drawImage
		(
			controlImage.systemImage,
			pos.x, pos.y,
			this.viewSize.x, this.viewSize.y
		);
	}

	DisplayHelper.prototype.drawControlLabel = function(control)
	{
		var pos = control.pos;
		var size = control.size;
		var text = control.text;

		var textHeight = this.fontHeightInPixels;

		var textMargins;

		if (control.isTextCentered == true)
		{
			var textWidth = this.graphics.measureText(text).width;
			textMargins = new Coords
			(
				(size.x - textWidth) / 2,
				(size.y - textHeight) / 2
			);
		}
		else
		{
			textMargins = new Coords
			(
				2,
				(size.y - textHeight) / 2
			);
		}

		this.graphics.fillStyle = "Gray";
		this.graphics.fillText
		(
			text,
			pos.x + textMargins.x ,
			pos.y + textMargins.y + textHeight
		);				
	}

	DisplayHelper.prototype.drawControlList = function(list)
	{
		var pos = list.pos
		var size = list.size;

		this.drawRectangle
		(
			pos, size, "Gray", "White"
		);

		this.graphics.fillStyle = "Gray";
		var itemSizeY = list.itemSpacing;
		var textMarginLeft = 2;
		var itemPosY = pos.y;

		var items = list.items();

		var numberOfItemsVisible = Math.floor(size.y / itemSizeY);
		var indexStart = list.indexOfFirstItemVisible;
		var indexEnd = indexStart + numberOfItemsVisible - 1;
		if (indexEnd >= items.length)
		{
			indexEnd = items.length - 1;
		}

		for (var i = indexStart; i <= indexEnd; i++)
		{
			if (i == list.indexOfItemSelected)
			{
				this.graphics.strokeRect
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

			itemPosY += itemSizeY;

			this.graphics.fillText
			(
				text,
				pos.x + textMarginLeft,
				itemPosY
			);			
		}
	}

	DisplayHelper.prototype.drawControlSelect = function(control)
	{
		var pos = control.pos;
		var size = control.size;

		var colorsForeAndBack = ["Gray", "White"];

		this.drawRectangle
		(
			pos, size, 
			colorsForeAndBack[0], colorsForeAndBack[1]
		)

		var text = control.optionSelected().text;

		var textWidth = this.graphics.measureText(text).width;
		var textMarginLeft = (control.size.x - textWidth) / 2;
		var textHeight = this.fontHeightInPixels;
		var textMarginTop = (control.size.y - textHeight) / 2;

		this.graphics.fillStyle = colorsForeAndBack[0];
		this.graphics.fillText
		(
			text,
			pos.x + textMarginLeft,
			pos.y + textMarginTop + textHeight
		);
	}


	DisplayHelper.prototype.drawControlTextBox = function(control)
	{
		var pos = control.pos;
		var size = control.size;

		var text = control.text;
		var colorsForeAndBack;

		if (control.isHighlighted == true)
		{
			colorsForeAndBack = ["White", "Gray"];
			text += "|";
		}
		else
		{
			colorsForeAndBack = ["Gray", "White"];
		}

		this.drawRectangle
		(
			pos, size, 
			colorsForeAndBack[0], colorsForeAndBack[1]
		)

		var textWidth = this.graphics.measureText(text).width;
		var textMarginLeft = (size.x - textWidth) / 2;
		var textHeight = this.fontHeightInPixels;		
		var textMarginTop = (size.y - textHeight) / 2;

		this.graphics.fillStyle = colorsForeAndBack[0];
		this.graphics.fillText
		(
			text,
			pos.x + textMarginLeft ,
			pos.y + textMarginTop + textHeight
		);				
	}

	DisplayHelper.prototype.drawRectangle = function
	(
		pos, size, colorBorder, colorBack
	)
	{
		this.graphics.fillStyle = colorBack;
		this.graphics.fillRect
		(
			pos.x, pos.y,
			size.x, size.y
		);

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = colorBorder;
			this.graphics.strokeRect
			(
				pos.x, pos.y,
				size.x, size.y
			);
		}
	}

	DisplayHelper.prototype.hide = function()
	{
		Globals.Instance.divMain.removeChild(this.canvasLive);		
	}

	DisplayHelper.prototype.initialize = function()
	{
		this.canvasBuffer = document.createElement("canvas");
		this.canvasBuffer.width = this.viewSize.x;
		this.canvasBuffer.height = this.viewSize.y;

		this.graphics = this.canvasBuffer.getContext("2d");
		this.graphics.font = 
			"" + this.fontHeightInPixels + "px sans-serif";

		/*
		this.canvasLive = document.createElement("canvas");
		this.canvasLive.width = this.viewSize.x;
		this.canvasLive.height = this.viewSize.y;
		this.graphicsLive = this.canvasLive.getContext("2d");
		*/

		// hack - double-buffering test
		this.canvasLive = this.canvasBuffer;
		this.graphicsLive = this.graphics;

		Globals.Instance.divMain.appendChild(this.canvasLive);
	}

	DisplayHelper.prototype.refresh = function()
	{
		this.graphicsLive.drawImage(this.canvasBuffer, 0, 0);
	}

	DisplayHelper.prototype.show = function()
	{
		Globals.Instance.divMain.appendChild(this.canvasLive);		
	}
}
