
function Display(viewSize, fontHeightInPixels, colorFore, colorBack)
{
	this.viewSize = viewSize;
	this.fontHeightInPixels = fontHeightInPixels;
	this.colorFore = colorFore;
	this.colorBack = colorBack;
}

{
	Display.prototype.clear = function(colorBorder, colorBack)
	{
		this.drawRectangle
		(
			new Coords(0, 0), 
			this.viewSize, 
			(colorBack == null ? this.colorBack : colorBack), 
			(colorBorder == null ? this.colorFore : colorBorder)
		);
	}

	Display.prototype.drawControlButton = function(control)
	{
		var pos = control.pos;
		var size = control.size;

		this.drawRectangle
		(
			pos, size, 
			this.colorBack, this.colorFore,
			control.isHighlighted // areColorsReversed
		)

		var text = control.text;

		var textWidth = this.graphics.measureText(text).width;
		var textSize = new Coords(textWidth, this.fontHeightInPixels);
		var textMargin = size.clone().subtract(textSize).divideScalar(2);
		var drawPos = pos.clone().add(textMargin);

		this.drawText(text, drawPos, this.colorFore, this.colorBack, control.isHighlighted);
	}

	Display.prototype.drawControlContainer = function(container)
	{
		var pos = container.pos
		var size = container.size;

		this.drawRectangle
		(
			pos, size, this.colorBack, this.colorFore
		)

		var children = container.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.draw();
		}
	}

	Display.prototype.drawControlImage = function(controlImage)
	{
		var pos = controlImage.pos
		var size = controlImage.size;

		this.drawRectangle
		(
			pos, size, this.colorBack, this.colorFore
		)

		this.graphics.drawImage
		(
			controlImage.systemImage,
			pos.x, pos.y,
			this.viewSize.x, this.viewSize.y
		);
	}

	Display.prototype.drawControlLabel = function(control)
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

		var drawPos = pos.clone().add(textMargins);
		this.drawText(text, drawPos, this.colorFore);				
	}

	Display.prototype.drawControlList = function(list)
	{
		var pos = list.pos
		var size = list.size;

		this.drawRectangle
		(
			pos, size, 
			this.colorBack, this.colorFore, 
			list.isHighlighted // areColorsReversed
		);

		this.graphics.fillStyle = (list.isHighlighted == true ? this.colorBack : this.colorFore);
		this.graphics.strokeStyle = (list.isHighlighted == true ? this.colorBack : this.colorFore);

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

			var drawPos = new Coords(pos.x + textMarginLeft, itemPosY);

			this.drawText(text, drawPos, this.colorFore, this.colorBack, list.isHighlighted);			
		}
	}

	Display.prototype.drawControlSelect = function(control)
	{
		var pos = control.pos;
		var size = control.size;

		this.drawRectangle
		(
			pos, size, 
			this.colorBack, this.colorFore,
			control.isHighlighted // areColorsReversed
		)

		var text = control.optionSelected().text;

		var textWidth = this.graphics.measureText(text).width;
		var drawPos = pos.clone().add(control.size).add(new Coords(textWidth, 0)).divideScalar(2);

		this.drawText(text, pos.clone().add(textMargin), this.colorFore);
	}

	Display.prototype.drawControlTextBox = function(control)
	{
		var pos = control.pos;
		var size = control.size;

		var text = control.text;

		this.drawRectangle
		(
			pos, size, 
			this.colorBack, this.colorFore,
			control.isHighlighted // areColorsReversed
		)

		var textWidth = this.graphics.measureText(text).width;
		var textMarginLeft = (size.x - textWidth) / 2;
		var textHeight = this.fontHeightInPixels;		
		var textMarginTop = (size.y - textHeight) / 2;
		var textMargin = new Coords(textMarginLeft, textMarginTop);

		var drawPos = pos.clone().add(textMargin);
		this.drawText(text, drawPos, this.colorFore);				

		if (control.isHighlighted == true)
		{
			var textBeforeCursor = control.text.substr(0, control.cursorPos);
			var textAtCursor = control.text.substr(control.cursorPos, 1);
			var cursorX = this.graphics.measureText(textBeforeCursor).width;
			var cursorWidth = this.graphics.measureText(textAtCursor).width;
			drawPos.x += cursorX;
			drawPos.y -= textHeight;
			
			this.drawRectangle
			(
				drawPos,
				new Coords(cursorWidth, this.fontHeightInPixels), // size
				this.colorBack, // colorFill
				null // colorBorder
			);

			drawPos.y += textHeight;
			
			this.drawText
			(
				textAtCursor,
				drawPos,
				this.colorFore
			)
		}

	}

	Display.prototype.drawRectangle = function
	(
		pos, size, colorFill, colorBorder, areColorsReversed
	)
	{
		if (areColorsReversed == true)
		{
			var temp = colorFill;
			colorFill = colorBorder;
			colorBorder = temp;
		}

		if (colorFill != null)
		{
			this.graphics.fillStyle = colorFill;
			this.graphics.fillRect
			(
				pos.x, pos.y,
				size.x, size.y
			);
		}

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

	Display.prototype.drawText = function
	(
		text, pos, colorFill, colorReverse, areColorsReversed
	)
	{
		if (areColorsReversed == true)
		{
			var temp = colorFill;
			colorFill = colorReverse;
			colorReverse = temp;
		}

		if (colorFill != null)
		{
			this.graphics.fillStyle = colorFill;
			this.graphics.fillText
			(
				text,
				pos.x, pos.y + this.fontHeightInPixels
			);
		}
	}

	Display.prototype.hide = function()
	{
		Globals.Instance.divMain.removeChild(this.canvasLive);		
	}

	Display.prototype.initialize = function()
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

	Display.prototype.refresh = function()
	{
		this.graphicsLive.drawImage(this.canvasBuffer, 0, 0);
	}

	Display.prototype.show = function()
	{
		Globals.Instance.divMain.appendChild(this.canvasLive);		
	}
}
