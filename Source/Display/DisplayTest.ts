
namespace ThisCouldBeBetter.GameFramework
{

export class DisplayTest implements Display
{
	sizesAvailable: Coords[];
	fontNameAndHeight: FontNameAndHeight;
	colorFore: Color;
	colorBack: Color;
	isInvisible: boolean

	sizeInPixels: Coords;
	sizeInPixelsHalf: Coords;

	constructor
	(
		sizesAvailable: Coords[],
		fontNameAndHeight: FontNameAndHeight,
		colorFore: Color, colorBack: Color,
		isInvisible: boolean
	)
	{
		this.sizesAvailable = sizesAvailable;
		this.fontNameAndHeight =
			fontNameAndHeight || FontNameAndHeight.default();
		this.colorFore = colorFore;
		this.colorBack = colorBack;
		this.isInvisible = isInvisible || false;

		this.sizeInPixels = this.sizesAvailable[0].clone();
		this.sizeInPixelsHalf = this.sizeInPixels.clone().half();
	}

	static default(): DisplayTest
	{
		return DisplayTest.fromSize(Coords.fromXY(100, 100));
	}

	static fromSize(size: Coords): DisplayTest
	{
		return new DisplayTest([size], null, null, null, false);
	}

	static fromSizeAndIsInvisible(size: Coords, isInvisible: boolean): DisplayTest
	{
		return new DisplayTest([size], null, null, null, isInvisible);
	}

	clear(): void {}

	colorAtPos(pos: Coords, colorOut: Color): Color
	{
		throw new Error("Not implemented!");
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
	{}

	drawBackground(colorBack: Color, colorBorder: Color): void
	{}

	drawCircle
	(
		center: Coords, radius: number, colorFill: Color,
		colorBorder: Color, borderThickness: number
	): void
	{}

	drawCircleWithGradient
	(
		center: Coords,
		radius: number,
		gradientFill: ValueBreakGroup<Color>,
		colorBorder: Color
	): void
	{}

	drawCrosshairs
	(
		center: Coords,
		numberOfLines: number,
		radiusOuter: number,
		radiusInner: number,
		color: Color,
		lineThickness: number
	): void
	{}

	drawEllipse
	(
		center: Coords, semimajorAxis: number, semiminorAxis: number,
		rotationInTurns: number, colorFill: Color, colorBorder: Color
	): void
	{}

	drawImage(imageToDraw: Image2, pos: Coords): void
	{}

	drawImagePartial
	(
		imageToDraw: Image2, pos: Coords, regionToDrawAsBox: Box
	): void
	{}

	drawImagePartialScaled
	(
		imageToDraw: Image2, pos: Coords, regionToDrawAsBox: Box, sizeToDraw: Coords
	): void
	{}

	drawImageScaled(imageToDraw: Image2, pos: Coords, size: Coords): void
	{}

	drawLine
	(
		fromPos: Coords, toPos: Coords, color: Color, lineThickness: number
	): void
	{}

	drawMeshWithOrientation
	(
		mesh: MeshTextured, meshOrientation: Orientation
	): void
	{}

	drawPath
	(
		vertices: Coords[], color: Color, lineThickness: number, isClosed: boolean
	): void
	{}

	drawPixel(pos: Coords, color: Color): void
	{}

	drawPolygon
	(
		vertices: Coords[], colorFill: Color, colorBorder: Color
	): void
	{}

	drawRectangle
	(
		pos: Coords, size: Coords, colorFill: Color, colorBorder: Color
	): void
	{}

	drawRectangleCentered
	(
		pos: Coords, size: Coords, colorFill: Color, colorBorder: Color
	): void
	{}

	drawRectangleWithBeveledCorners
	(
		pos: Coords, size: Coords, colorFill: Color, colorBorder: Color,
		cornerRadius: number
	): void
	{}

	drawRectangleWithRoundedCorners
	(
		pos: Coords, size: Coords, colorFill: Color, colorBorder: Color,
		cornerRadius: number
	): void
	{}

	drawText
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
	{}

	drawWedge
	(
		center: Coords, radius: number, angleStartInTurns: number,
		angleStopInTurns: number, colorFill: Color, colorBorder: Color
	): void
	{}

	eraseModeSet(value: boolean): void
	{}

	fontSet(fontNameAndHeight: FontNameAndHeight): void
	{}

	flush(): void {}

	hide(universe: Universe): void
	{}

	initialize(universe: Universe): Display
	{
		return this;
	}

	rotateTurnsAroundCenter
	(
		turnsToRotate: number, centerOfRotation: Coords
	): void
	{}

	sizeDefault(): Coords
	{
		return this.sizesAvailable[0];
	}

	scaleFactor(): Coords
	{
		return Coords.ones();
	}

	stateRestore(): void
	{}

	stateSave(): void
	{}

	textWidthForFontHeight
	(
		textToMeasure: string, fontHeightInPixels: number
	): number
	{
		return fontHeightInPixels * textToMeasure.length;
	}

	toImage(name: string): Image2
	{
		return null;
	}

	// platformable

	toDomElement(): HTMLElement
	{
		if (this._domElement == null)
		{
			this._domElement = document.createElement("div");
		}

		return this._domElement;
	}
	private _domElement: HTMLElement;
}

}
