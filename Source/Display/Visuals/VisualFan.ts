
namespace ThisCouldBeBetter.GameFramework
{

export class VisualFan implements Visual<VisualFan>
{
	radius: number;
	angleStartInTurns: number;
	angleSpannedInTurns: number;
	colorFill: Color;
	colorBorder: Color;

	_drawPos: Coords;
	_polar: Polar;

	constructor
	(
		radius: number, angleStartInTurns: number,
		angleSpannedInTurns: number, colorFill: Color, colorBorder: Color
	)
	{
		this.radius = radius;
		this.angleStartInTurns = angleStartInTurns;
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
			drawableAngleInTurns + this.angleStartInTurns;
		var wedgeAngleMax = wedgeAngleMin + this.angleSpannedInTurns;

		display.drawArc
		(
			drawPos, // center
			0, this.radius,
			wedgeAngleMin, wedgeAngleMax,
			this.colorFill, this.colorBorder
		);
	}

	// Clonable.

	clone(): VisualFan
	{
		return new VisualFan
		(
			this.radius,
			this.angleStartInTurns,
			this.angleSpannedInTurns,
			this.colorFill.clone(),
			(this.colorBorder == null ? null : this.colorBorder.clone())
		)
	}

	overwriteWith(other: VisualFan): VisualFan
	{
		this.radius = other.radius;
		this.angleStartInTurns = other.angleStartInTurns;
		this.angleSpannedInTurns = other.angleSpannedInTurns;
		this.colorFill.overwriteWith(other.colorFill);
		if (this.colorBorder != null)
		{
			this.colorBorder.overwriteWith(other.colorBorder);
		}
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualFan
	{
		return this;
	}
}

}
