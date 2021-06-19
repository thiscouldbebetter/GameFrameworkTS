
namespace ThisCouldBeBetter.GameFramework
{

export class VisualEllipse implements Visual
{
	semiaxisHorizontal: number;
	semiaxisVertical: number;
	rotationInTurns: number;
	colorFill: Color;
	colorBorder: Color;

	constructor
	(
		semiaxisHorizontal: number, semiaxisVertical: number,
		rotationInTurns: number, colorFill: Color, colorBorder: Color
	)
	{
		this.semiaxisHorizontal = semiaxisHorizontal;
		this.semiaxisVertical = semiaxisVertical;
		this.rotationInTurns = rotationInTurns || 0;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	static fromSemiaxesAndColorFill
	(
		semiaxisHorizontal: number, semiaxisVertical: number, colorFill: Color
	): VisualEllipse
	{
		return new VisualEllipse
		(
			semiaxisHorizontal, semiaxisVertical, null, colorFill, null
		)
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		var drawableLoc = entity.locatable().loc;
		var drawableOrientation = drawableLoc.orientation;
		var drawableRotationInTurns =
			drawableOrientation.forward.headingInTurns();
		display.drawEllipse
		(
			drawableLoc.pos,
			this.semiaxisHorizontal, this.semiaxisVertical,
			NumberHelper.wrapToRangeZeroOne
			(
				this.rotationInTurns + drawableRotationInTurns
			),
			this.colorFill,
			this.colorBorder
		);
	}

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

}
