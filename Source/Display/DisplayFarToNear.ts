
namespace ThisCouldBeBetter.GameFramework
{

export class DisplayFarToNear implements Display
{
	sizesAvailable: Coords[];
	fontNameAndHeight: FontNameAndHeight;
	colorFore: Color;
	colorBack: Color;
	isInvisible: boolean

	sizeInPixels: Coords;
	sizeInPixelsHalf: Coords;

	displayInner: Display2D;
	drawMethodAndDistancePairs: any[];

	constructor(displayInner: Display2D)
	{
		this.displayInner = displayInner;

		this.sizesAvailable = displayInner.sizesAvailable;
		this.fontNameAndHeight =
			displayInner.fontNameAndHeight;
		this.colorFore = displayInner.colorFore;
		this.colorBack = displayInner.colorBack;
		this.isInvisible = displayInner.isInvisible;

		this.sizeInPixels = displayInner.sizeInPixels;
		this.sizeInPixelsHalf = displayInner.sizeInPixelsHalf;

		this.drawMethodAndDistancePairs = new Array<any[]>();
	}

	drawMethodAddAtDistance
	(
		distance: number,
		drawMethod: () => void
	): void
	{
		var drawMethodAndDistancePairs = this.drawMethodAndDistancePairs;

		var i = 0;
		for (var i = 0; i < drawMethodAndDistancePairs.length; i++)
		{
			var drawMethodAndDistancePairExisting = drawMethodAndDistancePairs[i];
			var distanceExisting = drawMethodAndDistancePairExisting[1];
			if (distance > distanceExisting) // Using ">" rather than ">=" preserves the order of multiple visuals for same drawable.
			{
				break;
			}
		}
		
		var drawMethodAndDistance = [ drawMethod, distance ];
		drawMethodAndDistancePairs.splice(i, 0, drawMethodAndDistance);
	}

	// Display.

	clear(): void
	{
		this.displayInner.clear();
		this.drawMethodAndDistancePairs.length = 0;
	}

	colorAtPos(pos: Coords, colorOut: Color): Color
	{
		return this.displayInner.colorAtPos(pos, colorOut);
	}

	colorBackSet(value: Color): Display
	{
		this.colorBack = value;
		return this;
	}

	colorForeSet(value: Color): Display
	{
		this.colorFore = value;
		return this;
	}

	displayToUse(): Display
	{
		return this.displayInner.displayToUse();
	}

	drawArc
	(
		center: Coords, radiusInner: number, radiusOuter: number,
		angleStartInTurns: number, angleStopInTurns: number,
		colorFill: Color, colorBorder: Color
	): void
	{
		center = center.clone();
		this.drawMethodAddAtDistance
		(
			center.z,
			() => this.displayInner.drawArc
			(
				center, radiusInner, radiusOuter,
				angleStartInTurns, angleStopInTurns,
				colorFill, colorBorder
			)
		);
	}

	drawBackground(): void
	{
		this.drawBackgroundWithColorsBackAndBorder(this.colorBack, this.colorFore)
	}

	drawBackgroundWithColorsBackAndBorder
	(
		colorBack: Color, colorBorder: Color
	): void
	{
		this.drawMethodAddAtDistance
		(
			Number.POSITIVE_INFINITY,
			() =>
				this.displayInner.drawBackgroundWithColorsBackAndBorder
				(
					colorBack, colorBorder
				)
		);
	}

	drawCircle
	(
		center: Coords, radius: number,
		colorFill: Color, colorBorder: Color,
		borderThickness: number
	): void
	{
		center = center.clone();
		this.drawMethodAddAtDistance
		(
			center.z,
			() =>
				this.displayInner.drawCircle
				(
					center, radius, colorFill, colorBorder, borderThickness
				)
		);
	}

	drawCircleWithGradient
	(
		center: Coords,
		radius: number,
		gradientFill: ValueBreakGroup<Color>,
		colorBorder: Color
	): void
	{
		center = center.clone();
		this.drawMethodAddAtDistance
		(
			center.z,
			() =>
				this.displayInner.drawCircleWithGradient
				(
					center, radius, gradientFill, colorBorder
				)
		);
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
		center = center.clone();
		this.drawMethodAddAtDistance
		(
			center.z,
			() =>
				this.displayInner.drawCrosshairs
				(
					center, numberOfLines, radiusOuter, radiusInner, color, lineThickness
				)
		);
	}

	drawEllipse
	(
		center: Coords, semimajorAxis: number, semiminorAxis: number,
		rotationInTurns: number,
		colorFill: Color, colorBorder: Color
	): void
	{
		center = center.clone();
		this.drawMethodAddAtDistance
		(
			center.z,
			() =>
				this.displayInner.drawEllipse
				(
					center, semimajorAxis, semiminorAxis,
					rotationInTurns, colorFill, colorBorder
				)
		);
	}

	drawImage(imageToDraw: Image2, pos: Coords): void
	{
		pos = pos.clone();
		this.drawMethodAddAtDistance
		(
			pos.z,
			() => this.displayInner.drawImage(imageToDraw, pos)
		);
	}

	drawImagePartial
	(
		imageToDraw: Image2, pos: Coords, regionToDrawAsBox: BoxAxisAligned
	): void
	{
		pos = pos.clone();
		this.drawMethodAddAtDistance
		(
			pos.z,
			() =>
				this.displayInner.drawImagePartial(imageToDraw, pos, regionToDrawAsBox)
		);
	}

	drawImagePartialScaled
	(
		imageToDraw: Image2, pos: Coords,
		regionToDrawAsBox: BoxAxisAligned, sizeToDraw: Coords
	): void
	{
		pos = pos.clone();
		this.drawMethodAddAtDistance
		(
			pos.z,
			() =>
				this.displayInner.drawImagePartialScaled
				(
					imageToDraw, pos, regionToDrawAsBox, sizeToDraw
				)
		);
	}

	drawImageScaled(imageToDraw: Image2, pos: Coords, size: Coords): void
	{
		pos = pos.clone();
		this.drawMethodAddAtDistance
		(
			pos.z,
			() =>
				this.displayInner.drawImageScaled
				(
					imageToDraw, pos, size
				)
		);
	}

	drawLine
	(
		fromPos: Coords, toPos: Coords, color: Color, lineThickness: number
	): void
	{
		fromPos = fromPos.clone();
		toPos = toPos.clone();

		this.drawMethodAddAtDistance
		(
			fromPos.z,
			() =>
				this.displayInner.drawLine
				(
					fromPos, toPos, color, lineThickness
				)
		);
	}

	drawMeshWithOrientation
	(
		mesh: MeshTextured, meshOrientation: Orientation
	): void
	{
		var meshVertices = mesh.vertices();
		var pos = meshVertices[0];
		this.drawMethodAddAtDistance
		(
			pos.z, // hack
			() =>
				this.displayInner.drawMeshWithOrientation
				(
					mesh, meshOrientation
				)
		);
	}

	drawPath
	(
		vertices: Coords[], color: Color, lineThickness: number, isClosed: boolean
	): void
	{
		this.drawMethodAddAtDistance
		(
			vertices[0].z, // hack
			() =>
				this.displayInner.drawPath
				(
					vertices, color, lineThickness, isClosed
				)
		);
	}

	drawPixel(pos: Coords, color: Color): void
	{
		pos = pos.clone();
		this.drawMethodAddAtDistance
		(
			pos.z,
			() =>
				this.displayInner.drawPixel
				(
					pos, color
				)
		);
	}

	drawPolygon
	(
		vertices: Coords[], colorFill: Color, colorBorder: Color
	): void
	{
		this.drawMethodAddAtDistance
		(
			vertices[0].z, // hack
			() =>
				this.displayInner.drawPolygon
				(
					vertices, colorFill, colorBorder
				)
		);
	}

	drawRectangle
	(
		pos: Coords, size: Coords, colorFill: Color, colorBorder: Color
	): void
	{
		pos = pos.clone();
		this.drawMethodAddAtDistance
		(
			pos.z,
			() =>
				this.displayInner.drawRectangle
				(
					pos, size, colorFill, colorBorder
				)
		);
	}

	drawRectangleCentered
	(
		pos: Coords, size: Coords,
		colorFill: Color, colorBorder: Color
	): void
	{
		pos = pos.clone();
		this.drawMethodAddAtDistance
		(
			pos.z,
			() =>
				this.displayInner.drawRectangleCentered
				(
					pos, size, colorFill, colorBorder
				)
		);
	}

	drawRectangleWithBeveledCorners
	(
		pos: Coords, size: Coords,
		colorFill: Color, colorBorder: Color,
		cornerRadius: number
	): void
	{
		pos = pos.clone();
		this.drawMethodAddAtDistance
		(
			pos.z,
			() =>
				this.displayInner.drawRectangleWithBeveledCorners
				(
					pos, size, colorFill, colorBorder, cornerRadius
				)
		);
	}

	drawRectangleWithRoundedCorners
	(
		pos: Coords, size: Coords,
		colorFill: Color, colorBorder: Color,
		cornerRadius: number
	): void
	{
		pos = pos.clone();
		this.drawMethodAddAtDistance
		(
			pos.z,
			() =>
				this.displayInner.drawRectangleWithRoundedCorners
				(
					pos, size, colorFill, colorBorder, cornerRadius
				)
		);
	}

	drawTextWithFontAtPos
	(
		text: string,
		fontNameAndHeight: FontNameAndHeight,
		pos: Coords
	): void
	{
		this.drawTextWithFontAtPosWithColorsFillAndOutline
		(
			text, fontNameAndHeight, pos, null, null, null, null, null
		);
	}

	drawTextWithFontAtPosWithColorsFillAndOutline
	(
		text: string,
		fontNameAndHeight: FontNameAndHeight,
		pos: Coords,
		colorFill: Color,
		colorOutline: Color,
		isCenteredHorizontally: boolean,
		isCenteredVertically: boolean,
		sizeMaxInPixels: Coords
	): void
	{
		pos = pos.clone();
		this.drawMethodAddAtDistance
		(
			pos.z,
			() =>
				this.displayInner.drawTextWithFontAtPosWithColorsFillAndOutline
				(
					text, fontNameAndHeight, pos,
					colorFill, colorOutline,
					isCenteredHorizontally, isCenteredVertically,
					sizeMaxInPixels
				)
		);
	}

	drawWedge
	(
		center: Coords, radius: number,
		angleStartInTurns: number, angleStopInTurns: number,
		colorFill: Color, colorBorder: Color
	): void
	{
		center = center.clone();
		this.drawMethodAddAtDistance
		(
			center.z,
			() =>
				this.displayInner.drawWedge
				(
					center, radius,
					angleStartInTurns, angleStopInTurns,
					colorFill, colorBorder
				)
		);
	}

	eraseModeSet(value: boolean): void
	{
		throw new Error("Not supported: DisplayFarToNear.eraseModeSet().")
	}

	finalize(universe: Universe): Display
	{
		return this.displayInner.finalize(universe);
	}

	fontSet(fontNameAndHeight: FontNameAndHeight): void
	{
		this.displayInner.fontSet(fontNameAndHeight);
	}

	flush(): void
	{
		this.drawMethodAndDistancePairs.forEach
		(
			x => x[0]()
		);
	}

	hide(universe: Universe): void
	{
		this.displayInner.hide(universe);
	}

	initialize(universe: Universe): Display
	{
		return this.displayInner.initialize(universe);
	}

	rotateTurnsAroundCenter
	(
		turnsToRotate: number, centerOfRotation: Coords
	): void
	{
		throw new Error("Not supported: DisplayFarToNear.rotateTurnsAroundCenter().")
	}

	sizeDefault(): Coords
	{
		return this.displayInner.sizeDefault();
	}

	scaleFactor(): Coords
	{
		return this.displayInner.scaleFactor();
	}

	stateRestore(): void
	{
		throw new Error("Not supported: DisplayFarToNear.stateRestore().")
	}

	stateSave(): void
	{
		throw new Error("Not supported: DisplayFarToNear.stateSave().")
	}

	textWidthForFontHeight
	(
		textToMeasure: string, fontHeightInPixels: number
	): number
	{
		return this.displayInner.textWidthForFontHeight(textToMeasure, fontHeightInPixels);
	}

	toImage(name: string): Image2
	{
		return this.displayInner.toImage(name);
	}

	// platformable

	toDomElement(): HTMLElement
	{
		return this.displayInner.toDomElement();
	}
}

}
