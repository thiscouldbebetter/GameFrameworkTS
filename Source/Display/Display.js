
function Display(sizesAvailable, fontName, fontHeightInPixels, colorFore, colorBack)
{
	this.sizesAvailable = sizesAvailable;
	this._sizeDefault = this.sizesAvailable[0];
	this.sizeInPixels = this._sizeDefault;
	this.fontName = fontName;
	this.fontHeightInPixels = fontHeightInPixels || 10;
	this.colorFore = colorFore;
	this.colorBack = colorBack;

	this.fontNameFallthrough = "serif";
	this.testString = "ABCDEFGHIJKMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz 1234567890";

	// Helper variables.

	this._drawPos = new Coords();
	this._sizeHalf = new Coords();
	this._zeroes = Coords.Instances().Zeroes;
}

{
	// constants

	Display.RadiansPerTurn = Math.PI * 2.0;

	// methods

	Display.prototype.clear = function()
	{
		this.graphics.clearRect
		(
			0, 0, this.sizeInPixels.x, this.sizeInPixels.y
		);
	};

	Display.prototype.drawArc = function
	(
		center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder
	)
	{
		var drawPos = this._drawPos.overwriteWith(center);
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
	};

	Display.prototype.drawBackground = function(colorBack, colorBorder)
	{
		this.drawRectangle
		(
			this._zeroes,
			this.sizeDefault(), // Automatic scaling.
			colorBack,
			colorBorder
		);
	};

	Display.prototype.drawCircle = function(center, radius, colorFill, colorBorder)
	{
		var drawPos = this._drawPos.overwriteWith(center);

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
	};

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
	};

	Display.prototype.drawCrosshairs = function(center, radius, color)
	{
		var drawPos = this._drawPos.overwriteWith(center);
		this.graphics.beginPath();
		this.graphics.strokeStyle = color;
		this.graphics.moveTo(drawPos.x - radius, drawPos.y);
		this.graphics.lineTo(drawPos.x + radius, drawPos.y);
		this.graphics.moveTo(drawPos.x, drawPos.y - radius);
		this.graphics.lineTo(drawPos.x, drawPos.y + radius);
		this.graphics.stroke();
	};

	Display.prototype.drawEllipse = function
	(
		center, semimajorAxis, semiminorAxis, rotationInTurns, colorFill, colorBorder
	)
	{
		var drawPos = this._drawPos.overwriteWith(center);

		this.graphics.save();

		this.graphics.translate(center.x, center.y);

		var rotationInRadians = rotationInTurns * Polar.RadiansPerTurn;
		this.graphics.rotate(rotationInRadians);

		var ratioOfHeightToWidth = semiminorAxis / semimajorAxis;
		this.graphics.scale(1, ratioOfHeightToWidth);

		this.graphics.beginPath();
		this.graphics.arc
		(
			0, 0, // center
			semimajorAxis, // "radius"
			0, Math.PI * 2.0 // start, stop angle
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

		this.graphics.restore();
	};

	Display.prototype.drawImage = function(imageToDraw, pos)
	{
		this.graphics.drawImage(imageToDraw.systemImage, pos.x, pos.y);
	};

	Display.prototype.drawImagePartial = function(imageToDraw, pos, boundsToShow)
	{
		var sourcePos = boundsToShow.min();
		var sourceSize = boundsToShow.size;

		this.graphics.drawImage
		(
			imageToDraw.systemImage,
			sourcePos.x, sourcePos.y, sourceSize.x, sourceSize.y,
			pos.x, pos.y, sourceSize.x, sourceSize.y
		);
	};

	Display.prototype.drawImageScaled = function(imageToDraw, pos, size)
	{
		this.graphics.drawImage(imageToDraw.systemImage, pos.x, pos.y, size.x, size.y);
	};

	Display.prototype.drawLine = function(fromPos, toPos, color, lineThickness)
	{
		var drawPos = this._drawPos;

		this.graphics.strokeStyle = color;
		var lineWidthToRestore = this.graphics.lineWidth;
		if (lineThickness != null)
		{
			this.graphics.lineWidth = lineThickness;
		}

		this.graphics.beginPath();

		drawPos.overwriteWith(fromPos);
		this.graphics.moveTo(drawPos.x, drawPos.y);

		drawPos.overwriteWith(toPos);
		this.graphics.lineTo(drawPos.x, drawPos.y);

		this.graphics.stroke();

		this.graphics.lineWidth = lineWidthToRestore;
	};

	Display.prototype.drawPath = function(vertices, color, lineThickness)
	{
		var lineWidthSaved = this.graphics.lineWidth;

		this.graphics.lineWidth = (lineThickness == null ? 1 : lineThickness);

		this.graphics.beginPath();

		var drawPos = this._drawPos;

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

		this.graphics.strokeStyle = color;

		this.graphics.stroke();

		this.graphics.lineWidth = lineWidthSaved;
	};

	Display.prototype.drawPixel = function(pos, color)
	{
		this.graphics.fillStyle = color;
		this.graphics.fillRect
		(
			pos.x, pos.y, 1, 1
		);
	};

	Display.prototype.drawPolygon = function(vertices, colorFill, colorBorder)
	{
		this.graphics.beginPath();

		var drawPos = this._drawPos;

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
	};

	Display.prototype.drawRectangle = function
	(
		pos,
		size,
		colorFill,
		colorBorder,
		areColorsReversed
	)
	{
		if (areColorsReversed)
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
	};

	Display.prototype.drawRectangleCentered = function
	(
		pos,
		size,
		colorFill,
		colorBorder
	)
	{
		var sizeHalf = this._sizeHalf.overwriteWith(size).half();
		var posAdjusted = this._drawPos.overwriteWith(pos).subtract(sizeHalf);
		this.drawRectangle(posAdjusted, size, colorFill, colorBorder);
	};

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

		if (areColorsReversed)
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
		if (isCentered)
		{
			drawPos.addDimensions(0 - textWidthInPixels / 2, 0 - fontHeightInPixels / 2, 0);
		}

		if (colorOutline != null)
		{
			this.graphics.strokeStyle = colorOutline;
			this.graphics.strokeText(textTrimmed, drawPos.x, drawPos.y);
		}

		if (colorFill == null)
		{
			colorFill = this.colorFore;
		}

		this.graphics.fillStyle = colorFill;
		this.graphics.fillText
		(
			textTrimmed,
			drawPos.x,
			drawPos.y
		);

		this.graphics.font = fontToRestore;
	};

	Display.prototype.fontSizeSet = function(fontHeightInPixels)
	{
		var isFontValid = this.fontNameSet(this.fontName);
		var fontNameToUse = (isFontValid ? this.fontName : "sans-serif");
		this.graphics.font = fontHeightInPixels + "px " + fontNameToUse;
	};

	Display.prototype.fontNameSet = function(fontName)
	{
		this.graphics.font = "" + this.fontHeightInPixels + "px " + fontName;
		var widthWithFontSpecified = this.graphics.measureText(this.testString).width;
		var returnValue = (widthWithFontSpecified != this.widthWithFontFallthrough);
		return returnValue;
	};

	Display.prototype.hide = function(universe)
	{
		universe.platformHelper.platformableRemove(this);
	};

	Display.prototype.initialize = function(universe)
	{
		if (this.canvas == null)
		{
			this.canvas = document.createElement("canvas");
		}

		this.canvas.width = this.sizeInPixels.x;
		this.canvas.height = this.sizeInPixels.y;

		this.graphics = this.canvas.getContext("2d");

		this.fontSizeSet(this.fontHeightInPixels);
		this.widthWithFontFallthrough = this.graphics.measureText(this.testString).width;

		this._scaleFactor = null;
		var scaleFactor = this.scaleFactor();
		this.graphics.scale(scaleFactor.x, scaleFactor.y);

		return this;
	};

	Display.prototype.sizeDefault = function()
	{
		return this._sizeDefault;
	};

	Display.prototype.scaleFactor = function()
	{
		if (this._scaleFactor == null)
		{
			var sizeBase = this.sizesAvailable[0];
			this._scaleFactor = this.sizeInPixels.clone().divide(sizeBase);
		}
		return this._scaleFactor;
	};

	Display.prototype.textWidthForFontHeight = function(textToMeasure, fontHeightInPixels)
	{
		var fontToRestore = this.graphics.font;
		this.fontSizeSet(fontHeightInPixels);
		var returnValue = this.graphics.measureText(textToMeasure).width;
		this.graphics.font = fontToRestore;
		return returnValue;
	};

	Display.prototype.toImage = function()
	{
		return Image.fromSystemImage("[fromDisplay]", this.canvas);
	};

	// platformable

	Display.prototype.toDomElement = function()
	{
		return this.canvas;
	};
}
