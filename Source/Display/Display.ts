
namespace ThisCouldBeBetter.GameFramework
{

export interface Display
{
	colorBack: Color;
	colorFore: Color;
	fontHeightInPixels: number;
	fontName: string;
	sizeInPixels: Coords;
	sizeInPixelsHalf: Coords;
	sizesAvailable: Coords[];

	clear(): void;
	displayToUse() : Display;
	drawArc
	(
		center: Coords, radiusInner: number, radiusOuter: number,
		angleStartInTurns: number, angleStopInTurns: number, colorFill: Color,
		colorBorder: Color
	): void;
	drawBackground(colorBack: Color, colorBorder: Color): void;
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
		imageToDraw: Image2, pos: Coords, regionToDrawAsBox: Box
	): void;
	drawImagePartialScaled
	(
		imageToDraw: Image2, pos: Coords, regionToDrawAsBox: Box, sizeToDraw: Coords
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
		pos: Coords, size: Coords, colorFill: Color, colorBorder: Color,
		areColorsReversed: boolean
	): void;
	drawRectangleCentered
	(
		pos: Coords, size: Coords, colorFill: Color, colorBorder: Color
	): void;
	drawText
	(
		text: string, fontHeightInPixels: number, pos: Coords,
		colorFill: Color, colorOutline: Color, areColorsReversed: boolean,
		isCentered: boolean, widthMaxInPixels: number
	): void;
	drawWedge
	(
		center: Coords, radius: number, angleStartInTurns: number,
		angleStopInTurns: number, colorFill: Color, colorBorder: Color
	): void;
	eraseModeSet(value: boolean): void;
	fontSet(fontName: string, fontHeightInPixels: number): void;
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
	toImage(): Image2;
	toDomElement(): HTMLElement;
}

}
