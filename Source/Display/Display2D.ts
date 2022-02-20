
namespace ThisCouldBeBetter.GameFramework
{

export class Display2D implements Display
{
	sizesAvailable: Coords[];
	fontNameAndHeight: FontNameAndHeight;
	colorFore: Color;
	colorBack: Color;
	isInvisible: boolean;

	canvas: HTMLCanvasElement;
	sizeInPixels: Coords;
	sizeInPixelsHalf: Coords;
	graphics: CanvasRenderingContext2D;

	_curveControlPos: Coords;
	_drawPos: Coords;
	_scaleFactor: Coords;
	_sizeDefault: Coords;
	_sizeHalf: Coords;
	_zeroes: Coords;

	constructor
	(
		sizesAvailable: Coords[],
		fontNameAndHeight: FontNameAndHeight,
		colorFore: Color,
		colorBack: Color,
		isInvisible: boolean
	)
	{
		this.sizesAvailable = sizesAvailable;
		this._sizeDefault = this.sizesAvailable[0];
		this.sizeInPixels = this._sizeDefault;
		this.fontNameAndHeight =
			fontNameAndHeight || FontNameAndHeight.default();
		this.colorFore = colorFore;
		this.colorBack = colorBack;
		this.isInvisible = isInvisible || false;

		// Helper variables.

		this._curveControlPos = Coords.create();
		this._drawPos = Coords.create();
		this._sizeHalf = Coords.create();
		this._zeroes = Coords.Instances().Zeroes;
	}

	static fromImage(image: Image2): Display2D
	{
		var returnDisplay = Display2D.fromSizeAndIsInvisible
		(
			image.sizeInPixels, true // isInvisible
		);

		returnDisplay.drawImage(image, Coords.Instances().Zeroes);

		return returnDisplay;
	}

	static fromSize(size: Coords): Display2D
	{
		return new Display2D([size], null, null, null, false);
	}

	static fromSizeAndIsInvisible(size: Coords, isInvisible: boolean): Display2D
	{
		return new Display2D([size], null, null, null, isInvisible);
	}

	// constants

	static RadiansPerTurn = Math.PI * 2.0;

	clear(): void
	{
		this.graphics.clearRect
		(
			0, 0, this.sizeInPixels.x, this.sizeInPixels.y
		);
	}

	colorAtPos(pos: Coords, colorOut: Color): Color
	{
		var colorAsComponentsRGBA =
			this.graphics.getImageData(pos.x, pos.y, 1, 1).data;

		colorOut.overwriteWithComponentsRGBA255
		(
			colorAsComponentsRGBA
		);

		return colorOut;
	}

	displayToUse(): Display
	{
		return this;
	}

	drawArc
	(
		center: Coords, radiusInner: number, radiusOuter: number,
		angleStartInTurns: number, angleStopInTurns: number, colorFill: Color,
		colorBorder: Color
	): void
	{
		var drawPos = this._drawPos.overwriteWith(center);
		var angleStartInRadians = angleStartInTurns * Display2D.RadiansPerTurn;
		var angleStopInRadians = angleStopInTurns * Display2D.RadiansPerTurn;

		if (colorFill != null)
		{
			this.graphics.fillStyle = Color.systemColorGet(colorFill);

			this.graphics.beginPath();
			this.graphics.arc
			(
				center.x, center.y,
				radiusInner,
				angleStartInRadians, angleStopInRadians
			);
			drawPos.overwriteWith(center).add
			(
				new Polar(angleStopInTurns, radiusOuter, 0).toCoords( Coords.create() )
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
			this.graphics.strokeStyle = Color.systemColorGet(colorBorder);
			this.graphics.beginPath();
			this.graphics.arc
			(
				center.x, center.y,
				radiusInner,
				angleStartInRadians, angleStopInRadians
			);
			drawPos.overwriteWith(center).add
			(
				new Polar(angleStopInTurns, radiusOuter, 0).toCoords( Coords.create() )
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

	drawBackground(colorBack: Color, colorBorder: Color): void
	{
		this.drawRectangle
		(
			this._zeroes,
			this.sizeDefault(), // Automatic scaling.
			colorBack || this.colorBack,
			colorBorder || this.colorFore
		);
	}

	drawCircle
	(
		center: Coords, radius: number, colorFill: Color,
		colorBorder: Color, borderThickness: number
	): void
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
			this.graphics.fillStyle = Color.systemColorGet(colorFill);
			this.graphics.fill();
		}

		if (colorBorder != null)
		{
			var lineWidthToRestore = this.graphics.lineWidth;

			this.graphics.lineWidth = borderThickness;
			this.graphics.strokeStyle = Color.systemColorGet(colorBorder);
			this.graphics.stroke();

			this.graphics.lineWidth = lineWidthToRestore;
		}
	}

	drawCircleWithGradient
	(
		center: Coords,
		radius: number,
		gradientFill: ValueBreakGroup<Color>,
		colorBorder: Color
	): void
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
			this.graphics.strokeStyle = Color.systemColorGet(colorBorder);
			this.graphics.stroke();
		}
	}

	drawCrosshairs
	(
		center: Coords,
		numberOfLines: number,
		radiusOuter: number,
		radiusInner: number,
		color: Color,
		lineThickness: number
	): void
	{
		var drawPos = this._drawPos;

		var g = this.graphics;

		g.beginPath();
		g.strokeStyle = Color.systemColorGet(color);
		g.lineWidth = lineThickness;

		var polarForLine = Polar.default();
		var offset = Coords.create();

		for (var i = 0; i < numberOfLines; i++)
		{
			polarForLine.azimuthInTurns = NumberHelper.wrapToRangeMax
			(
				.75 + i / numberOfLines, 1
			);

			polarForLine.radius = radiusInner;
			drawPos.overwriteWith(center).add(polarForLine.toCoords(offset));
			g.moveTo(drawPos.x, drawPos.y);

			polarForLine.radius = radiusOuter;
			drawPos.overwriteWith(center).add(polarForLine.toCoords(offset));
			g.lineTo(drawPos.x, drawPos.y);
		}

		g.stroke();
	}

	drawEllipse
	(
		center: Coords, semimajorAxis: number, semiminorAxis: number,
		rotationInTurns: number, colorFill: Color, colorBorder: Color
	): void
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
			this.graphics.fillStyle = Color.systemColorGet(colorFill);
			this.graphics.fill();
		}

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = Color.systemColorGet(colorBorder);
			this.graphics.stroke();
		}

		this.graphics.restore();
	}

	drawImage(imageToDraw: Image2, pos: Coords): void
	{
		this.graphics.drawImage(imageToDraw.systemImage, pos.x, pos.y);
	}

	drawImagePartial
	(
		imageToDraw: Image2, pos: Coords, regionToDrawAsBox: Box
	): void
	{
		this.drawImagePartialScaled(imageToDraw, pos, regionToDrawAsBox, null);
	}

	drawImagePartialScaled
	(
		imageToDraw: Image2, pos: Coords, regionToDrawAsBox: Box, sizeToDraw: Coords
	): void
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

	drawImageScaled(imageToDraw: Image2, pos: Coords, size: Coords): void
	{
		this.graphics.drawImage(imageToDraw.systemImage, pos.x, pos.y, size.x, size.y);
	}

	drawLine
	(
		fromPos: Coords, toPos: Coords, color: Color, lineThickness: number
	): void
	{
		var drawPos = this._drawPos;

		this.graphics.strokeStyle = Color.systemColorGet(color);
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

	drawMeshWithOrientation
	(
		mesh: MeshTextured, meshOrientation: Orientation
	): void
	{
		// todo
	}

	drawPath
	(
		vertices: Coords[], color: Color, lineThickness: number, isClosed: boolean
	): void
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

		this.graphics.strokeStyle = Color.systemColorGet(color);

		this.graphics.stroke();

		this.graphics.lineWidth = lineWidthSaved;
	}

	drawPixel(pos: Coords, color: Color): void
	{
		this.graphics.fillStyle = Color.systemColorGet(color);
		this.graphics.fillRect
		(
			pos.x, pos.y, 1, 1
		);
	}

	drawPolygon
	(
		vertices: Coords[], colorFill: Color, colorBorder: Color
	): void
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
			this.graphics.fillStyle = Color.systemColorGet(colorFill);
			this.graphics.fill();
		}

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = Color.systemColorGet(colorBorder);
			this.graphics.stroke();
		}
	}

	drawRectangle
	(
		pos: Coords, size: Coords, colorFill: Color, colorBorder: Color
	): void
	{
		if (colorFill != null)
		{
			this.graphics.fillStyle = Color.systemColorGet(colorFill);
			this.graphics.fillRect
			(
				pos.x, pos.y,
				size.x, size.y
			);
		}

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = Color.systemColorGet(colorBorder);
			this.graphics.strokeRect
			(
				pos.x, pos.y,
				size.x, size.y
			);
		}
	}

	drawRectangleCentered
	(
		pos: Coords, size: Coords, colorFill: Color, colorBorder: Color
	): void
	{
		var sizeHalf = this._sizeHalf.overwriteWith(size).half();
		var posAdjusted = this._drawPos.overwriteWith(pos).subtract(sizeHalf);
		this.drawRectangle(posAdjusted, size, colorFill, colorBorder);
	}

	drawRectangleWithBeveledCorners
	(
		pos: Coords, size: Coords,
		colorFill: Color, colorBorder: Color,
		cornerRadius: number
	): void
	{
		var drawPos = this._drawPos;

		this.graphics.beginPath();

		drawPos.overwriteWith(pos).addXY(cornerRadius, 0);
		this.graphics.moveTo(drawPos.x, drawPos.y);

		drawPos.addXY(size.x - cornerRadius * 2, 0);
		this.graphics.lineTo(drawPos.x, drawPos.y)

		drawPos.addXY(cornerRadius, cornerRadius);
		this.graphics.lineTo(drawPos.x, drawPos.y);

		drawPos.addXY(0, size.y - cornerRadius * 2);
		this.graphics.lineTo(drawPos.x, drawPos.y);

		drawPos.addXY(0 - cornerRadius, cornerRadius);
		this.graphics.lineTo(drawPos.x, drawPos.y);

		drawPos.addXY(0 - (size.x - cornerRadius * 2), 0);
		this.graphics.lineTo(drawPos.x, drawPos.y)

		drawPos.addXY(0 - cornerRadius, 0 - cornerRadius);
		this.graphics.lineTo(drawPos.x, drawPos.y);

		drawPos.addXY(0, 0 - (size.y - cornerRadius * 2) );
		this.graphics.lineTo(drawPos.x, drawPos.y);

		drawPos.addXY(cornerRadius, 0 - cornerRadius );
		this.graphics.lineTo(drawPos.x, drawPos.y);

		this.graphics.closePath();

		if (colorFill != null)
		{
			this.graphics.fillStyle = Color.systemColorGet(colorFill);
			this.graphics.fill();
		}

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = Color.systemColorGet(colorBorder);
			this.graphics.stroke();
		}
	}

	drawRectangleWithRoundedCorners
	(
		pos: Coords, size: Coords,
		colorFill: Color, colorBorder: Color,
		cornerRadius: number
	): void
	{
		var drawPos = this._drawPos;
		var curveControlPos = this._curveControlPos;

		this.graphics.beginPath();

		drawPos.overwriteWith(pos).addXY(cornerRadius, 0);
		this.graphics.moveTo(drawPos.x, drawPos.y);

		drawPos.addXY(size.x - cornerRadius * 2, 0);
		this.graphics.lineTo(drawPos.x, drawPos.y)

		curveControlPos.overwriteWith(drawPos).addXY(cornerRadius, 0);
		drawPos.addXY(cornerRadius, cornerRadius);
		this.graphics.quadraticCurveTo(curveControlPos.x, curveControlPos.y, drawPos.x, drawPos.y);

		drawPos.addXY(0, size.y - cornerRadius * 2);
		this.graphics.lineTo(drawPos.x, drawPos.y);

		curveControlPos.overwriteWith(drawPos).addXY(0, cornerRadius);
		drawPos.addXY(0 - cornerRadius, cornerRadius);
		this.graphics.quadraticCurveTo(curveControlPos.x, curveControlPos.y, drawPos.x, drawPos.y);

		drawPos.addXY(0 - (size.x - cornerRadius * 2), 0);
		this.graphics.lineTo(drawPos.x, drawPos.y)

		curveControlPos.overwriteWith(drawPos).addXY(0 - cornerRadius, 0);		
		drawPos.addXY(0 - cornerRadius, 0 - cornerRadius);
		this.graphics.quadraticCurveTo(curveControlPos.x, curveControlPos.y, drawPos.x, drawPos.y);

		drawPos.addXY(0, 0 - (size.y - cornerRadius * 2) );
		this.graphics.lineTo(drawPos.x, drawPos.y);

		curveControlPos.overwriteWith(drawPos).addXY(0, 0 - cornerRadius);
		drawPos.addXY(cornerRadius, 0 - cornerRadius );
		this.graphics.quadraticCurveTo(curveControlPos.x, curveControlPos.y, drawPos.x, drawPos.y);

		this.graphics.closePath();

		if (colorFill != null)
		{
			this.graphics.fillStyle = Color.systemColorGet(colorFill);
			this.graphics.fill();
		}

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = Color.systemColorGet(colorBorder);
			this.graphics.stroke();
		}
	}

	drawText
	(
		text: string,
		fontHeightInPixels: number,
		pos: Coords,
		colorFill: Color,
		colorOutline: Color,
		isCenteredHorizontally: boolean,
		isCenteredVertically: boolean,
		sizeMaxInPixels: Coords
	): void
	{
		var fontToRestore = this.graphics.font;

		this.fontSet(this.fontNameAndHeight);

		if (colorFill == null)
		{
			colorFill = this.colorFore;
		}

		this.graphics.fillStyle = Color.systemColorGet(colorFill);

		var drawPos =
			this._drawPos.overwriteWith(pos).addDimensions(0, fontHeightInPixels, 0);

		var textAsLinesHard = text.split("\r").join("").split("\n");
		var textAsLines = new Array<string>();

		var heightOfLinesSoFar = 0;

		for (var i = 0; i < textAsLinesHard.length; i++)
		{
			var lineToWrap = textAsLinesHard[i];

			if (sizeMaxInPixels == null)
			{
				textAsLines.push(lineToWrap);
			}
			else
			{
				while
				(
					lineToWrap.length > 0
					&& heightOfLinesSoFar < sizeMaxInPixels.y
				)
				{
					var lineTrimmedToWidth =
						this.drawText_StringTrimToAllowedWidth
						(
							lineToWrap, fontHeightInPixels, sizeMaxInPixels
						);

					textAsLines.push(lineTrimmedToWidth);

					heightOfLinesSoFar += fontHeightInPixels;

					lineToWrap = lineToWrap.substr(lineTrimmedToWidth.length);
				}
			}
		}

		if (isCenteredHorizontally)
		{
			if (sizeMaxInPixels != null)
			{
				drawPos.x += sizeMaxInPixels.x / 2;
			}
		}

		if (isCenteredVertically)
		{
			if (sizeMaxInPixels != null)
			{
				drawPos.y += sizeMaxInPixels.y / 2;
			}
			drawPos.y -=
				fontHeightInPixels * (textAsLines.length / 2 + 0.1);
		}

		for (var i = 0; i < textAsLines.length; i++)
		{
			var textLine = textAsLines[i];

			var textLineTrimmed =
				this.drawText_StringTrimToAllowedWidth
				(
					textLine, fontHeightInPixels, sizeMaxInPixels
				);

			var textWidthInPixels = this.textWidthForFontHeight
			(
				textLineTrimmed, fontHeightInPixels
			);

			var horizontalCenteringOffset = 
			(
				isCenteredHorizontally
				? 0 - textWidthInPixels / 2
				: 0
			);

			if (colorOutline != null)
			{
				this.graphics.strokeStyle = Color.systemColorGet(colorOutline);
				this.graphics.strokeText
				(
					textLineTrimmed,
					drawPos.x + horizontalCenteringOffset,
					drawPos.y
				);
			}

			this.graphics.fillText
			(
				textLineTrimmed,
				drawPos.x + horizontalCenteringOffset,
				drawPos.y
			);

			drawPos.y += fontHeightInPixels;
		}

		this.graphics.font = fontToRestore;
	}

	drawText_StringTrimToAllowedWidth
	(
		stringToTrim: string,
		fontHeightInPixels: number,
		sizeMaxInPixels: Coords
	): string
	{
		var stringTrimmed = stringToTrim;
		if (sizeMaxInPixels != null)
		{
			var textLineWidth = this.textWidthForFontHeight
			(
				stringTrimmed, fontHeightInPixels
			);

			while (textLineWidth > sizeMaxInPixels.x)
			{
				stringTrimmed =
					stringTrimmed.substr(0, stringTrimmed.length - 1);

				textLineWidth = this.textWidthForFontHeight
				(
					stringTrimmed, fontHeightInPixels
				);
			}
		}

		return stringTrimmed;
	}

	drawWedge
	(
		center: Coords, radius: number, angleStartInTurns: number,
		angleStopInTurns: number, colorFill: Color, colorBorder: Color
	): void
	{
		var drawPos = this._drawPos.overwriteWith(center);
		var angleStartInRadians = angleStartInTurns * Display2D.RadiansPerTurn;
		var angleStopInRadians = angleStopInTurns * Display2D.RadiansPerTurn;

		if (colorFill != null)
		{
			this.graphics.fillStyle = Color.systemColorGet(colorFill);

			this.graphics.beginPath();
			this.graphics.moveTo(center.x, center.y);
			drawPos.overwriteWith(center).add
			(
				new Polar(angleStopInTurns, radius, 0).toCoords( Coords.create() )
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
			this.graphics.strokeStyle = Color.systemColorGet(colorBorder);
			this.graphics.beginPath();
			this.graphics.moveTo(center.x, center.y);
			drawPos.overwriteWith(center).add
			(
				new Polar(angleStopInTurns, radius, 0).toCoords( Coords.create() )
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

	eraseModeSet(value: boolean): void
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

	fontSet(fontNameAndHeight: FontNameAndHeight): void
	{
		if (fontNameAndHeight.equals(this.fontNameAndHeight) == false)
		{
			this.fontNameAndHeight = fontNameAndHeight;
			this.graphics.font = this.fontNameAndHeight.toStringSystemFont();
		}
	}

	flush(): void {}

	hide(universe: Universe): void
	{
		universe.platformHelper.platformableRemove(this);
	}

	initialize(universe: Universe): Display
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

	rotateTurnsAroundCenter
	(
		turnsToRotate: number, centerOfRotation: Coords
	): void
	{
		var graphics = this.graphics;

		graphics.translate(centerOfRotation.x, centerOfRotation.y);

		var rotationInRadians = turnsToRotate * Polar.RadiansPerTurn;
		graphics.rotate(rotationInRadians);

		graphics.translate(0 - centerOfRotation.x, 0 - centerOfRotation.y);
	}

	sizeDefault(): Coords
	{
		return this._sizeDefault;
	}

	scaleFactor(): Coords
	{
		if (this._scaleFactor == null)
		{
			var sizeBase = this.sizesAvailable[0];
			this._scaleFactor = this.sizeInPixels.clone().divide(sizeBase);
		}
		return this._scaleFactor;
	}

	stateRestore(): void
	{
		this.graphics.restore();
	}

	stateSave(): void
	{
		this.graphics.save();
	}

	textWidthForFontHeight
	(
		textToMeasure: string, fontHeightInPixels: number
	): number
	{
		var fontToRestore = this.graphics.font;
		this.fontSet(this.fontNameAndHeight);
		var returnValue = this.graphics.measureText(textToMeasure).width;
		this.graphics.font = fontToRestore;
		return returnValue;
	}

	toImage(): Image2
	{
		return Image2.fromSystemImage("[fromDisplay]", this.canvas);
	}

	// platformable

	toDomElement(): HTMLElement
	{
		if (this.canvas == null)
		{
			this.canvas = document.createElement("canvas");

			this.canvas.width = this.sizeInPixels.x;
			this.canvas.height = this.sizeInPixels.y;
			this.canvas.oncontextmenu = () => false;

			this.graphics = this.canvas.getContext("2d");

			this.fontSet(this.fontNameAndHeight);

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
