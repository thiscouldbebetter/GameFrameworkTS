
namespace ThisCouldBeBetter.GameFramework
{

export class VisualArc implements Visual<VisualArc>
{
	radiusOuter: number;
	radiusInner: number;
	directionMin: Coords;
	angleSpannedInTurns: number;
	colorFill: Color;
	colorBorder: Color;

	_drawPos: Coords;
	_polar: Polar;

	constructor
	(
		radiusOuter: number, radiusInner: number, directionMin: Coords,
		angleSpannedInTurns: number, colorFill: Color, colorBorder: Color
	)
	{
		this.radiusOuter = radiusOuter;
		this.radiusInner = radiusInner;
		this.directionMin = directionMin;
		this.angleSpannedInTurns = angleSpannedInTurns;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;

		// helper variables
		this._drawPos = Coords.create();
		this._polar = Polar.create();
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return true;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;

		var drawableLoc = Locatable.of(entity).loc;
		var drawPos = this._drawPos.overwriteWith
		(
			drawableLoc.pos
		);

		var drawableAngleInTurns = drawableLoc.orientation.forward.headingInTurns();
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
	}

	// Clonable.

	clone(): VisualArc
	{
		return new VisualArc
		(
			this.radiusOuter, this.radiusInner,
			this.directionMin.clone(),
			this.angleSpannedInTurns,
			this.colorFill.clone(),
			(this.colorBorder == null ? null : this.colorBorder.clone())
		)
	}

	overwriteWith(other: VisualArc): VisualArc
	{
		this.radiusOuter = other.radiusOuter;
		this.radiusInner = other.radiusInner;
		this.directionMin.overwriteWith(other.directionMin);
		this.angleSpannedInTurns = other.angleSpannedInTurns;
		this.colorFill.overwriteWith(other.colorFill);
		if (this.colorBorder != null)
		{
			this.colorBorder.overwriteWith(other.colorBorder);
		}
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualArc
	{
		transformToApply.transformCoords(this.directionMin);
		return this;
	}
}

}
