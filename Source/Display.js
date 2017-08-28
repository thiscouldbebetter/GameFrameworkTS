
function Display(sizeInPixels, fontHeightInPixels, colorFore, colorBack)
{
	this.sizeInPixels = sizeInPixels;
	this.fontHeightInPixels = fontHeightInPixels;
	this.colorFore = colorFore;
	this.colorBack = colorBack;

	// helper variables

	this.drawLoc = new Location(new Coords());
	this.drawPos = new Coords();
	this.drawPos2 = new Coords();
	this.drawPos3 = new Coords();
}

{
	// constants

	Display.RadiansPerTurn = Math.PI * 2.0;

	// methods

	Display.prototype.clear = function(colorBorder, colorBack)
	{
		this.drawRectangle
		(
			new Coords(0, 0),
			this.sizeInPixels,
			(colorBack == null ? this.colorBack : colorBack),
			(colorBorder == null ? this.colorFore : colorBorder)
		);
	}

	Display.prototype.drawArc = function
	(
		center, radius, colorFill, colorBorder, angleStartInTurns, angleStopInTurns
	)
	{
		var drawPos = this.drawPos.overwriteWith(center);
		var angleStartInRadians = angleStartInTurns * Display.RadiansPerTurn;
		var angleStopInRadians = angleStopInTurns * Display.RadiansPerTurn;

		if (colorFill != null)
		{
			this.graphics.fillStyle = colorFill;
			this.graphics.beginPath();
			this.graphics.arc
			(
				drawPos.x, drawPos.y,
				radius,
				angleStartInRadians, angleStopInRadians
			);
			this.graphics.fill();
		}

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = colorBorder;
			this.graphics.beginPath();
			this.graphics.arc
			(
				drawPos.x, drawPos.y,
				radius,
				angleStartInRadians, angleStopInRadians
			);
			this.graphics.stroke();
		}
	}

	Display.prototype.drawCircle = function(center, radius, colorFill, colorBorder)
	{
		this.drawArc(center, radius, colorFill, colorBorder, 0, 1);
	}

	Display.prototype.drawImage = function(imageToDraw, pos, size)
	{
		var systemImage = imageToDraw.systemImage;

		if (size == null)
		{
			this.graphics.drawImage(systemImage, pos.x, pos.y);
		}
		else
		{
			this.graphics.drawImage(systemImage, pos.x, pos.y, size.x, size.y);
		}
	}

	Display.prototype.drawLine = function(fromPos, toPos, color)
	{
		var drawPos = this.drawPos;

		this.graphics.strokeStyle = color;
			this.graphics.beginPath();

		drawPos.overwriteWith(fromPos);
		this.graphics.moveTo(drawPos.x, drawPos.y);

		drawPos.overwriteWith(toPos);
		this.graphics.lineTo(drawPos.x, drawPos.y);

		this.graphics.stroke();
	}

	Display.prototype.drawPolygon = function(vertices, colorFill, colorBorder)
	{
		this.graphics.beginPath();

		var drawPos = this.drawPos;

		for (var i = 0; i < vertices.length; i++)
		{
			var vertex = vertices[i];
			drawPos.overwriteWith(vertex);
			if (i == 0)
			{
				this.graphics.moveTo(drawPos.x, drawPos.y);
			}
			else
			{
				this.graphics.lineTo(drawPos.x, drawPos.y);
			}
		}

		this.graphics.closePath();

		if (colorFill != null)
		{
			this.graphics.fillStyle = colorFill;
			this.graphics.fill();
		}

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = colorBorder;
			this.graphics.stroke();
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
		text,
		fontHeightInPixels,
		pos,
		colorFill,
		colorOutline,
		areColorsReversed,
		isCentered,
		widthMaxInPixels
	)
	{
		var fontToRestore = this.graphics.font;
		if (fontHeightInPixels == null)
		{
			fontHeightInPixels = this.fontHeightInPixels;
		}
		else
		{
			this.graphics.font =
				"" + fontHeightInPixels + "px sans-serif";
		}

		if (areColorsReversed == true)
		{
			var temp = colorFill;
			colorFill = colorOutline;
			colorOutline = temp;
		}

		if (colorFill != null)
		{
			var textTrimmed = text;
			if (widthMaxInPixels != null)
			{
				while (this.textWidthForFontHeight(textTrimmed, fontHeightInPixels) > widthMaxInPixels)
				{
					textTrimmed = textTrimmed.substr(0, textTrimmed.length - 1);
				}
			}

			var textWidthInPixels = this.textWidthForFontHeight(textTrimmed, fontHeightInPixels);
			var drawPos = new Coords(pos.x, pos.y + fontHeightInPixels);
			if (isCentered == true)
			{
				drawPos.addDimensions(0 - textWidthInPixels / 2, 0 - fontHeightInPixels / 2, 0);
			}

			if (colorOutline != null)
			{
				this.graphics.strokeStyle = colorOutline;
				this.graphics.strokeText(textTrimmed, drawPos.x, drawPos.y);
			}

			this.graphics.fillStyle = colorFill;
			this.graphics.fillText
			(
				textTrimmed,
				drawPos.x,
				drawPos.y
			);
		}

		this.graphics.font = fontToRestore;
	}

	Display.prototype.hide = function()
	{
		Globals.Instance.platformHelper.domElementRemove(this.canvasLive);
	}

	Display.prototype.initialize = function()
	{
		this.canvasBuffer = document.createElement("canvas");
		this.canvasBuffer.width = this.sizeInPixels.x;
		this.canvasBuffer.height = this.sizeInPixels.y;

		this.graphics = this.canvasBuffer.getContext("2d");
		this.graphics.font =
			"" + this.fontHeightInPixels + "px sans-serif";

		/*
		this.canvasLive = document.createElement("canvas");
		this.canvasLive.width = this.sizeInPixels.x;
		this.canvasLive.height = this.sizeInPixels.y;
		this.graphicsLive = this.canvasLive.getContext("2d");
		*/

		// hack - double-buffering test
		this.canvasLive = this.canvasBuffer;
		this.graphicsLive = this.graphics;

		Globals.Instance.platformHelper.domElementAdd(this.canvasLive);
	}

	Display.prototype.refresh = function()
	{
		this.graphicsLive.drawImage(this.canvasBuffer, 0, 0);
	}

	Display.prototype.show = function()
	{
		Globals.Instance.platformHelper.domElementAdd(this.canvasLive);
	}

	Display.prototype.textWidthForFontHeight = function(textToMeasure, fontHeightInPixels)
	{
		var fontToRestore = this.graphics.font;
		this.graphics.font = "" + fontHeightInPixels + "px sans-serif";
		var returnValue = this.graphics.measureText(textToMeasure).width;
		this.graphics.font = fontToRestore;
		return returnValue;
	}
}
