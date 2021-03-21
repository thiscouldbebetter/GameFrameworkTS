
namespace ThisCouldBeBetter.GameFramework
{

export class Display2D implements Display
{
	sizesAvailable: Coords[];
	fontName: string;
	fontHeightInPixels: number
	colorFore: string;
	colorBack: string;
	isInvisible: boolean

	canvas: HTMLCanvasElement;
	sizeInPixels: Coords;
	sizeInPixelsHalf: Coords;
	graphics: CanvasRenderingContext2D;

	_drawPos: Coords;
	_scaleFactor: Coords;
	_sizeDefault: Coords;
	_sizeHalf: Coords;
	_zeroes: Coords;

	constructor
	(
		sizesAvailable: Coords[], fontName: string, fontHeightInPixels: number,
		colorFore: string, colorBack: string, isInvisible: boolean)
	{
		this.sizesAvailable = sizesAvailable;
		this._sizeDefault = this.sizesAvailable[0];
		this.sizeInPixels = this._sizeDefault;
		this.fontName = fontName;
		this.fontHeightInPixels = fontHeightInPixels || 10;
		this.colorFore = colorFore;
		this.colorBack = colorBack;
		this.isInvisible = isInvisible || false;

		// Helper variables.

		this._drawPos = Coords.blank();
		this._sizeHalf = Coords.blank();
		this._zeroes = Coords.Instances().Zeroes;
	}

	static fromSizeAndIsInvisible(size: Coords, isInvisible: boolean)
	{
		return new Display2D([size], null, null, null, null, isInvisible);
	}

	// constants

	static RadiansPerTurn = Math.PI * 2.0;

	clear()
	{
		this.graphics.clearRect
		(
			0, 0, this.sizeInPixels.x, this.sizeInPixels.y
		);
	}

	displayToUse(): Display
	{
		return this;
	}

	drawArc
	(
		center: Coords, radiusInner: number, radiusOuter: number,
		angleStartInTurns: number, angleStopInTurns: number, colorFill: string,
		colorBorder: string
	)
	{
		var drawPos = this._drawPos.overwriteWith(center);
		var angleStartInRadians = angleStartInTurns * Display2D.RadiansPerTurn;
		var angleStopInRadians = angleStopInTurns * Display2D.RadiansPerTurn;

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
				new Polar(angleStopInTurns, radiusOuter, 0).toCoords( Coords.blank() )
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
				new Polar(angleStopInTurns, radiusOuter, 0).toCoords( Coords.blank() )
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

	drawBackground(colorBack: string, colorBorder: string)
	{
		this.drawRectangle
		(
			this._zeroes,
			this.sizeDefault(), // Automatic scaling.
			colorBack || this.colorBack,
			colorBorder || this.colorFore,
			null
		);
	}

	drawCircle
	(
		center: Coords, radius: number, colorFill: string,
		colorBorder: string, borderThickness: number
	)
	{
		var drawPos = this._drawPos.overwriteWith(center);

		this.graphics.beginPath();
		this.graphics.arc
		(
			drawPos.x, drawPos.y,
			radius,
			0, Display2D.RadiansPerTurn
		);

		if (colorFill != null)
		{
			this.graphics.fillStyle = colorFill;
			this.graphics.fill();
		}

		if (colorBorder != null)
		{
			var lineWidthToRestore = this.graphics.lineWidth;

			this.graphics.lineWidth = borderThickness;
			this.graphics.strokeStyle = colorBorder;
			this.graphics.stroke();

			this.graphics.lineWidth = lineWidthToRestore;
		}
	}

	drawCircleWithGradient(center: Coords, radius: number, gradientFill: ValueBreakGroup, colorBorder: string)
	{
		this.graphics.beginPath();
		this.graphics.arc
		(
			center.x, center.y,
			radius,
			0, Display2D.RadiansPerTurn
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
			var stopColor = stop.value as Color;
			systemGradient.addColorStop(stop.position, stopColor.systemColor());
		}

		this.graphics.fillStyle = systemGradient;
		this.graphics.fill();

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = colorBorder;
			this.graphics.stroke();
		}
	}

	drawCrosshairs(center: Coords, radius: number, color: string)
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

	drawEllipse
	(
		center: Coords, semimajorAxis: number, semiminorAxis: number,
		rotationInTurns: number, colorFill: string, colorBorder: string
	)
	{
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
	}

	drawImage(imageToDraw: Image2, pos: Coords)
	{
		this.graphics.drawImage(imageToDraw.systemImage, pos.x, pos.y);
	}

	drawImagePartial(imageToDraw: Image2, pos: Coords, regionToDrawAsBox: Box)
	{
		this.drawImagePartialScaled(imageToDraw, pos, regionToDrawAsBox, null);
	}

	drawImagePartialScaled
	(
		imageToDraw: Image2, pos: Coords, regionToDrawAsBox: Box, sizeToDraw: Coords
	)
	{
		var sourcePos = regionToDrawAsBox.min();
		var sourceSize = regionToDrawAsBox.size;

		if (sizeToDraw == null)
		{
			sizeToDraw = sourceSize;
		}

		this.graphics.drawImage
		(
			imageToDraw.systemImage,
			sourcePos.x, sourcePos.y, sourceSize.x, sourceSize.y,
			pos.x, pos.y, sizeToDraw.x, sizeToDraw.y
		);
	}

	drawImageScaled(imageToDraw: Image2, pos: Coords, size: Coords)
	{
		this.graphics.drawImage(imageToDraw.systemImage, pos.x, pos.y, size.x, size.y);
	}

	drawLine(fromPos: Coords, toPos: Coords, color: string, lineThickness: number)
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
	}

	drawMeshWithOrientation(mesh: MeshTextured, meshOrientation: Orientation)
	{
		// todo
	}

	drawPath(vertices: Coords[], color: string, lineThickness: number, isClosed: boolean)
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

		if (isClosed)
		{
			this.graphics.closePath();
		}

		this.graphics.strokeStyle = color;

		this.graphics.stroke();

		this.graphics.lineWidth = lineWidthSaved;
	};

	drawPixel(pos: Coords, color: string)
	{
		this.graphics.fillStyle = color;
		this.graphics.fillRect
		(
			pos.x, pos.y, 1, 1
		);
	}

	drawPolygon(vertices: Coords[], colorFill: string, colorBorder: string)
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
	}

	drawRectangle
	(
		pos: Coords, size: Coords, colorFill: string, colorBorder: string, areColorsReversed: boolean
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
	}

	drawRectangleCentered
	(
		pos: Coords, size: Coords, colorFill: string, colorBorder: string
	)
	{
		var sizeHalf = this._sizeHalf.overwriteWith(size).half();
		var posAdjusted = this._drawPos.overwriteWith(pos).subtract(sizeHalf);
		this.drawRectangle(posAdjusted, size, colorFill, colorBorder, null);
	}

	drawText
	(
		text: string,
		fontHeightInPixels: number,
		pos: Coords,
		colorFill: string,
		colorOutline: string,
		areColorsReversed: boolean,
		isCentered: boolean,
		widthMaxInPixels: number
	)
	{
		var fontToRestore = this.graphics.font;
		if (fontHeightInPixels == null)
		{
			fontHeightInPixels = this.fontHeightInPixels;
		}

		this.fontSet(null, fontHeightInPixels);

		if (areColorsReversed)
		{
			var temp = colorFill;
			colorFill = colorOutline;
			colorOutline = temp;
		}

		if (colorFill == null)
		{
			colorFill = this.colorFore;
		}

		this.graphics.fillStyle = colorFill;

		var drawPos = new Coords(pos.x, pos.y + fontHeightInPixels, 0);

		var textAsLines = text.split("\n");
		for (var i = 0; i < textAsLines.length; i++)
		{
			var textLine = textAsLines[i];

			var textTrimmed = textLine;
			if (widthMaxInPixels != null)
			{
				while (this.textWidthForFontHeight(textTrimmed, fontHeightInPixels) > widthMaxInPixels)
				{
					textTrimmed = textTrimmed.substr(0, textTrimmed.length - 1);
				}
			}

			var textWidthInPixels = this.textWidthForFontHeight
			(
				textTrimmed, fontHeightInPixels
			);

			if (isCentered)
			{
				drawPos.addDimensions
				(
					0 - textWidthInPixels / 2,
					0 - (fontHeightInPixels / 2) * 1.2, // hack
					0)
				;
			}

			if (colorOutline != null)
			{
				this.graphics.strokeStyle = colorOutline;
				this.graphics.strokeText(textTrimmed, drawPos.x, drawPos.y);
			}

			this.graphics.fillText(textTrimmed, drawPos.x, drawPos.y);

			drawPos.y += fontHeightInPixels;
		}

		this.graphics.font = fontToRestore;
	}

	drawWedge
	(
		center: Coords, radius: number, angleStartInTurns: number,
		angleStopInTurns: number, colorFill: string, colorBorder: string
	)
	{
		var drawPos = this._drawPos.overwriteWith(center);
		var angleStartInRadians = angleStartInTurns * Display2D.RadiansPerTurn;
		var angleStopInRadians = angleStopInTurns * Display2D.RadiansPerTurn;

		if (colorFill != null)
		{
			this.graphics.fillStyle = colorFill;

			this.graphics.beginPath();
			this.graphics.moveTo(center.x, center.y);
			drawPos.overwriteWith(center).add
			(
				new Polar(angleStopInTurns, radius, 0).toCoords( Coords.blank() )
			);
			this.graphics.lineTo(drawPos.x, drawPos.y);
			this.graphics.arc
			(
				center.x, center.y,
				radius,
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
			this.graphics.moveTo(center.x, center.y);
			drawPos.overwriteWith(center).add
			(
				new Polar(angleStopInTurns, radius, 0).toCoords( Coords.blank() )
			);
			this.graphics.lineTo(drawPos.x, drawPos.y);
			this.graphics.arc
			(
				center.x, center.y,
				radius,
				angleStopInRadians, angleStartInRadians,
				true // counterclockwise
			);
			this.graphics.closePath();
			this.graphics.stroke();
		}
	}

	eraseModeSet(value: boolean)
	{
		if (value)
		{
			this.graphics.globalCompositeOperation = "destination-out"; // todo - ?
		}
		else
		{
			this.graphics.globalCompositeOperation = "source-atop";
		}
	}

	fontSet(fontName: string, fontHeightInPixels: number)
	{
		if (fontName != this.fontName || fontHeightInPixels != this.fontHeightInPixels)
		{
			this.fontName = fontName || this.fontName;
			this.fontHeightInPixels = fontHeightInPixels || this.fontHeightInPixels;
			this.graphics.font = this.fontHeightInPixels + "px " + this.fontName;
		}
	}

	flush() {}

	hide(universe: Universe)
	{
		universe.platformHelper.platformableRemove(this);
	}

	initialize(universe: Universe)
	{
		if (this.isInvisible)
		{
			this.toDomElement();
		}
		else if (universe == null)
		{
			// hack - Allows use of this class
			// without including PlatformHelper or Universe.
			var domElement = this.toDomElement();
			var divMain = document.getElementById("divMain");
			if (divMain == null)
			{
				divMain = document.createElement("div");
				divMain.id = "divMain";
				document.body.appendChild(divMain);
			}
			divMain.appendChild(domElement);
		}
		else
		{
			universe.platformHelper.platformableAdd(this);
		}

		return this;
	}

	rotateTurnsAroundCenter(turnsToRotate: number, centerOfRotation: Coords)
	{
		var graphics = this.graphics;

		graphics.translate(centerOfRotation.x, centerOfRotation.y);

		var rotationInRadians = turnsToRotate * Polar.RadiansPerTurn;
		graphics.rotate(rotationInRadians);

		graphics.translate(0 - centerOfRotation.x, 0 - centerOfRotation.y);
	}

	sizeDefault()
	{
		return this._sizeDefault;
	}

	scaleFactor()
	{
		if (this._scaleFactor == null)
		{
			var sizeBase = this.sizesAvailable[0];
			this._scaleFactor = this.sizeInPixels.clone().divide(sizeBase);
		}
		return this._scaleFactor;
	}

	stateRestore()
	{
		this.graphics.restore();
	}

	stateSave()
	{
		this.graphics.save();
	}

	textWidthForFontHeight(textToMeasure: string, fontHeightInPixels: number): number
	{
		var fontToRestore = this.graphics.font;
		this.fontSet(null, fontHeightInPixels);
		var returnValue = this.graphics.measureText(textToMeasure).width;
		this.graphics.font = fontToRestore;
		return returnValue;
	}

	toImage()
	{
		return Image2.fromSystemImage("[fromDisplay]", this.canvas);
	}

	// platformable

	toDomElement()
	{
		if (this.canvas == null)
		{
			this.canvas = document.createElement("canvas");

			this.canvas.width = this.sizeInPixels.x;
			this.canvas.height = this.sizeInPixels.y;
			this.canvas.oncontextmenu = () => false;

			this.graphics = this.canvas.getContext("2d");

			this.fontSet(null, this.fontHeightInPixels);

			// todo
			// var testString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			// var widthWithFontFallthrough = this.graphics.measureText(testString).width;

			this._scaleFactor = null;
			var scaleFactor = this.scaleFactor();
			this.graphics.scale(scaleFactor.x, scaleFactor.y);
		}

		return this.canvas;
	}
}

}
