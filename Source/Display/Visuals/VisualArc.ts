
class VisualArc
{
	radiusOuter: number;
	radiusInner: number;
	directionMin: Coords;
	angleSpannedInTurns: number;
	colorFill: any;
	colorBorder: any;

	_drawPos: Coords;
	_polar: Polar;

	constructor(radiusOuter, radiusInner, directionMin, angleSpannedInTurns, colorFill, colorBorder)
	{
		this.radiusOuter = radiusOuter;
		this.radiusInner = radiusInner;
		this.directionMin = directionMin;
		this.angleSpannedInTurns = angleSpannedInTurns;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;

		// helper variables
		this._drawPos = new Coords(0, 0, 0);
		this._polar = new Polar(0, 0, 0);
	}

	draw(universe, world, display, entity)
	{
		var drawableLoc = entity.locatable().loc;
		var drawPos = this._drawPos.overwriteWith
		(
			drawableLoc.pos
		);

		var drawableAngleInTurns = drawableLoc.orientation.headingInTurns();
		var wedgeAngleMin =
			drawableAngleInTurns
			+ this._polar.fromCoords(this.directionMin).azimuthInTurns;
		var wedgeAngleMax = wedgeAngleMin + this.angleSpannedInTurns;

		display.drawArc
		(
			drawPos, // center
			this.radiusInner, this.radiusOuter,
			wedgeAngleMin, wedgeAngleMax,
			this.colorFill, this.colorBorder
		);
	};
}
