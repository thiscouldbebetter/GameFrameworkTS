
interface Display
{
	colorBack: string;
	colorFore: string;
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
		angleStartInTurns: number, angleStopInTurns: number, colorFill: string,
		colorBorder: string
	): void;
	drawBackground(colorBack: string, colorBorder: string): void;
	drawCircle(center: Coords, radius: number, colorFill: string, colorBorder: string): void;
	drawCircleWithGradient(center: Coords, radius: number, gradientFill: Gradient, colorBorder: string): void;
	drawCrosshairs(center: Coords, radius: number, color: string): void;
	drawEllipse
	(
		center: Coords, semimajorAxis: number, semiminorAxis: number,
		rotationInTurns: number, colorFill: string, colorBorder: string
	): void;
	drawImage(imageToDraw: Image2, pos: Coords): void;
	drawImagePartial(imageToDraw: Image2, pos: Coords, boxToShow: Box): void;
	drawImageScaled(imageToDraw: Image2, pos: Coords, size: Coords): void;
	drawLine(fromPos: Coords, toPos: Coords, color: string, lineThickness: number): void;
	drawMeshWithOrientation(mesh: MeshTextured, meshOrientation: Orientation): void;
	drawPath(vertices: Coords[], color: string, lineThickness: number, isClosed: boolean): void;
	drawPixel(pos: Coords, color: string): void;
	drawPolygon(vertices: Coords[], colorFill: string, colorBorder: string): void;
	drawRectangle
	(
		pos: Coords, size: Coords, colorFill: string, colorBorder: string, areColorsReversed: boolean
	): void;
	drawRectangleCentered
	(
		pos: Coords, size: Coords, colorFill: string, colorBorder: string
	): void;
	drawText
	(
		text: string, fontHeightInPixels: number, pos: Coords,
		colorFill: string, colorOutline: string, areColorsReversed: boolean,
		isCentered: boolean, widthMaxInPixels: number
	): void;
	drawWedge
	(
		center: Coords, radius: number, angleStartInTurns: number,
		angleStopInTurns: number, colorFill: string, colorBorder: string
	): void;
	eraseModeSet(value: boolean): void;
	fontSet(fontName: string, fontHeightInPixels: number): void;
	flush(): void;
	hide(universe: Universe): void;
	initialize(universe: Universe): Display;
	rotateTurnsAroundCenter(turnsToRotate: number, centerOfRotation: Coords): void;
	sizeDefault(): Coords;
	scaleFactor(): Coords;
	stateRestore(): void;
	stateSave(): void;
	textWidthForFontHeight(textToMeasure: string, fontHeightInPixels: number): number;
	toImage(): Image2;
	toDomElement(): HTMLElement;
}
