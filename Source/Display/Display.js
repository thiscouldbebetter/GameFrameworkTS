
function Display(sizesAvailable, fontName, fontHeightInPixels, colorFore, colorBack)
{
	this.sizesAvailable = sizesAvailable;
	this.sizeDefault = this.sizesAvailable[0];
	this.sizeInPixels = this.sizeDefault;
	this.fontName = fontName;
	this.fontHeightInPixels = fontHeightInPixels;
	this.colorFore = colorFore;
	this.colorBack = colorBack;

	this.fontNameFallthrough = "serif";
	this.testString = "ABCDEFGHIJKMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz 1234567890";

	// helper variables

	this.drawPos = new Coords();
	this.drawLoc = new Location(this.drawPos);
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
			this.sizeDefault, // Automatic scaling.
			(colorBack == null ? this.colorBack : colorBack),
			(colorBorder == null ? this.colorFore : colorBorder)
		);
	}

	Display.prototype.drawArc = function
	(
		center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder
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
				center.x, center.y,
				radiusInner,
				angleStartInRadians, angleStopInRadians
			);
			drawPos.overwriteWith(center).add
			(
				new Polar(angleStopInTurns, radiusOuter).toCoords( new Coords() )
			);
			this.graphics.lineTo(drawPos.x, drawPos.y);
			this.graphics.arc
			(
				center.x, center.y,
				radiusOuter,
				angleStopInRadians, angleStartInRadians,
				true // counterclockwise
			);
			this.graphics.closePath();
			this.graphics.fill();
		}

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = colorBorder;
			this.graphics.beginPath();
			this.graphics.arc
			(
				center.x, center.y,
				radiusInner,
				angleStartInRadians, angleStopInRadians
			);
			drawPos.overwriteWith(center).add
			(
				new Polar(angleStopInTurns, radiusOuter).toCoords( new Coords() )
			);
			this.graphics.lineTo(drawPos.x, drawPos.y);
			this.graphics.arc
			(
				center.x, center.y,
				radiusOuter,
				angleStopInRadians, angleStartInRadians,
				true // counterclockwise
			);
			this.graphics.closePath();
			this.graphics.stroke();
		}
	}

	Display.prototype.drawCircle = function(center, radius, colorFill, colorBorder)
	{
		var drawPos = this.drawPos.overwriteWith(center);

		this.graphics.beginPath();
		this.graphics.arc
		(
			drawPos.x, drawPos.y,
			radius,
			0, Display.RadiansPerTurn
		);

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

	Display.prototype.drawCircleWithGradient = function(center, radius, gradientFill, colorBorder)
	{
		this.graphics.beginPath();
		this.graphics.arc
		(
			center.x, center.y,
			radius,
			0, Display.RadiansPerTurn
		);

		var systemGradient = this.graphics.createRadialGradient
		(
			center.x, center.y, 0,
			center.x, center.y, radius
		);

		var gradientStops = gradientFill.stops;
		for (var i = 0; i < gradientStops.length; i++)
		{
			var stop = gradientStops[i];
			systemGradient.addColorStop(stop.position, stop.color);
		}

		this.graphics.fillStyle = systemGradient;
		this.graphics.fill();

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = colorBorder;
			this.graphics.stroke();
		}

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
		pos,
		size,
		colorFill,
		colorBorder,
		areColorsReversed
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

		this.fontSizeSet(fontHeightInPixels);

		if (areColorsReversed == true)
		{
			var temp = colorFill;
			colorFill = colorOutline;
			colorOutline = temp;
		}

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

		if (colorFill != null)
		{
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

	Display.prototype.fontSizeSet = function(fontHeightInPixels)
	{
		var isFontValid = this.fontValidate(this.fontName);
		var fontNameToUse = (isFontValid == true ? this.fontName : "sans-serif");
		this.graphics.font = fontHeightInPixels + "px " + fontNameToUse;
	}

	Display.prototype.fontValidate = function(fontName)
	{
		this.graphics.font = "" + this.fontHeightInPixels + "px " + fontName;
		var widthWithFontSpecified = this.graphics.measureText(this.testString).width;
		var returnValue = (widthWithFontSpecified != this.widthWithFontFallthrough);
		return returnValue;
	}

	Display.prototype.hide = function(universe)
	{
		universe.platformHelper.domElementRemove(this.canvas);
	}

	Display.prototype.initialize = function(universe)
	{
		var platformHelper = universe.platformHelper;
		platformHelper.initialize(universe);

		if (this.canvas != null)
		{
			platformHelper.domElementRemove(this.canvas);
		}

		this.canvas = document.createElement("canvas");
		this.canvas.width = this.sizeInPixels.x;
		this.canvas.height = this.sizeInPixels.y;

		this.graphics = this.canvas.getContext("2d");

		this.graphics.font = "" + this.fontHeightInPixels + "px " + this.fontNameFallthrough;
		this.widthWithFontFallthrough = this.graphics.measureText(this.testString).width;

		var sizeBase = this.sizesAvailable[0];
		this.scaleFactor = this.sizeInPixels.clone().divide(sizeBase);
		this.graphics.scale(this.scaleFactor.x, this.scaleFactor.y);

		platformHelper.domElementAdd(this.canvas);
	}

	Display.prototype.show = function(universe)
	{
		universe.platformHelper.domElementAdd(this.canvas);
	}

	Display.prototype.textWidthForFontHeight = function(textToMeasure, fontHeightInPixels)
	{
		var fontToRestore = this.graphics.font;
		this.fontSizeSet(fontHeightInPixels);
		var returnValue = this.graphics.measureText(textToMeasure).width;
		this.graphics.font = fontToRestore;
		return returnValue;
	}
}
