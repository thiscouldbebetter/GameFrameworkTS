
class VisualArc implements Visual
{
	radiusOuter: number;
	radiusInner: number;
	directionMin: Coords;
	angleSpannedInTurns: number;
	colorFill: string;
	colorBorder: string;

	_drawPos: Coords;
	_polar: Polar;

	constructor(radiusOuter: number, radiusInner: number, directionMin: Coords, angleSpannedInTurns: number, colorFill: string, colorBorder: string)
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

	draw(universe: Universe, world: World, display: Display, entity: Entity)
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

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}