
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
