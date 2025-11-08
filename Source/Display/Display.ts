
namespace ThisCouldBeBetter.GameFramework
{

export interface Display
{
	colorBack: Color;
	colorFore: Color;
	fontNameAndHeight: FontNameAndHeight;
	sizeInPixels: Coords;
	sizeInPixelsHalf: Coords;
	sizesAvailable: Coords[];

	clear(): void;

	colorAtPos(pos: Coords, colorOut: Color): Color;

	colorBackSet(value: Color): Display;

	colorForeSet(value: Color): Display;

	displayToUse() : Display;

	drawArc
	(
		center: Coords, radiusInner: number, radiusOuter: number,
		angleStartInTurns: number, angleStopInTurns: number, colorFill: Color,
		colorBorder: Color
	): void;

	drawBackground(): void;

	drawBackgroundWithColorsBackAndBorder
	(
		colorBack: Color, colorBorder: Color
	): void;

	drawCircle
	(
		center: Coords, radius: number, colorFill: Color, colorBorder: Color,
		borderThickness: number
	): void;

	drawCircleWithGradient
	(
		center: Coords,
		radius: number,
		gradientFill: ValueBreakGroup<Color>,
		colorBorder: Color
	): void;

	drawCrosshairs
	(
		center: Coords, numberOfLines: number, radiusOuter: number,
		radiusInner: number, color: Color, lineThickness: number
	): void

	drawEllipse
	(
		center: Coords, semimajorAxis: number, semiminorAxis: number,
		rotationInTurns: number, colorFill: Color, colorBorder: Color
	): void;

	drawImage(imageToDraw: Image2, pos: Coords): void;

	drawImagePartial
	(
		imageToDraw: Image2, pos: Coords, regionToDrawAsBox: BoxAxisAligned
	): void;

	drawImagePartialScaled
	(
		imageToDraw: Image2, pos: Coords, regionToDrawAsBox: BoxAxisAligned, sizeToDraw: Coords
	): void;

	drawImageScaled(imageToDraw: Image2, pos: Coords, size: Coords): void;

	drawLine(fromPos: Coords, toPos: Coords, color: Color, lineThickness: number): void;

	drawMeshWithOrientation(mesh: MeshTextured, meshOrientation: Orientation): void;

	drawPath
	(
		vertices: Coords[], color: Color, lineThickness: number, isClosed: boolean
	): void;

	drawPixel(pos: Coords, color: Color): void;

	drawPolygon(vertices: Coords[], colorFill: Color, colorBorder: Color): void;

	drawRectangle
	(
		pos: Coords, size: Coords, colorFill: Color, colorBorder: Color
	): void;

	drawRectangleCentered
	(
		pos: Coords, size: Coords, colorFill: Color, colorBorder: Color
	): void;

	drawRectangleWithBeveledCorners
	(
		pos: Coords, size: Coords,
		colorFill: Color, colorBorder: Color,
		cornerRadius: number
	): void;

	drawRectangleWithRoundedCorners
	(
		pos: Coords, size: Coords,
		colorFill: Color, colorBorder: Color,
		cornerRadius: number
	): void;

	drawTextWithFontAtPos
	(
		text: string,
		fontNameAndHeight: FontNameAndHeight,
		pos: Coords
	): void;

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
	): void;

	drawWedge
	(
		center: Coords, radius: number, angleStartInTurns: number,
		angleStopInTurns: number, colorFill: Color, colorBorder: Color
	): void;

	eraseModeSet(value: boolean): void;

	fontSet(fontNameAndHeight: FontNameAndHeight): void;

	flush(): void;

	hide(universe: Universe): void;

	initialize(universe: Universe): Display;

	rotateTurnsAroundCenter
	(
		turnsToRotate: number, centerOfRotation: Coords
	): void;

	sizeDefault(): Coords;

	scaleFactor(): Coords;

	stateRestore(): void;

	stateSave(): void;

	textWidthForFontHeight
	(
		textToMeasure: string, fontHeightInPixels: number
	): number;

	toImage(name: string): Image2;

	toDomElement(): HTMLElement;
}

}
