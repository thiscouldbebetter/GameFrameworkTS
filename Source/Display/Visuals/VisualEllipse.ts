
namespace ThisCouldBeBetter.GameFramework
{

export class VisualEllipse implements Visual<VisualEllipse>
{
	semiaxisHorizontal: number;
	semiaxisVertical: number;
	rotationInTurns: number;
	colorFill: Color;
	colorBorder: Color;
	shouldUseEntityOrientation: boolean

	constructor
	(
		semiaxisHorizontal: number, semiaxisVertical: number,
		rotationInTurns: number, colorFill: Color, colorBorder: Color,
		shouldUseEntityOrientation: boolean
	)
	{
		this.semiaxisHorizontal = semiaxisHorizontal;
		this.semiaxisVertical = semiaxisVertical;
		this.rotationInTurns = rotationInTurns || 0;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
		this.shouldUseEntityOrientation = shouldUseEntityOrientation || false;
	}

	static fromSemiaxesAndColorFill
	(
		semiaxisHorizontal: number, semiaxisVertical: number, colorFill: Color
	): VisualEllipse
	{
		return new VisualEllipse
		(
			semiaxisHorizontal, semiaxisVertical, null, colorFill, null, null
		)
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		var drawableLoc = entity.locatable().loc;

		var rotationInTurns = this.rotationInTurns;

		if (this.shouldUseEntityOrientation)
		{
			var drawableOrientation = drawableLoc.orientation;
			var drawableRotationInTurns =
				drawableOrientation.forward.headingInTurns();
			rotationInTurns += + drawableRotationInTurns;
		}

		display.drawEllipse
		(
			drawableLoc.pos,
			this.semiaxisHorizontal, this.semiaxisVertical,
			NumberHelper.wrapToRangeZeroOne
			(
				rotationInTurns
			),
			this.colorFill,
			this.colorBorder
		);
	}

	// Clonable.

	clone(): VisualEllipse
	{
		return new VisualEllipse
		(
			this.semiaxisHorizontal,
			this.semiaxisVertical,
			this.rotationInTurns,
			this.colorFill,
			this.colorBorder,
			this.shouldUseEntityOrientation
		);
	}

	overwriteWith(other: VisualEllipse): VisualEllipse
	{
		this.semiaxisHorizontal = other.semiaxisHorizontal;
		this.semiaxisVertical = other.semiaxisVertical;
		this.rotationInTurns = other.rotationInTurns;
		this.colorFill = other.colorFill;
		this.colorBorder = other.colorBorder;
		this.shouldUseEntityOrientation = other.shouldUseEntityOrientation;

		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualEllipse
	{
		return this; // todo
	}
}

}
