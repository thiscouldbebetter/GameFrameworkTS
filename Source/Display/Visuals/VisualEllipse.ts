
class VisualEllipse implements Visual
{
	semimajorAxis: number;
	semiminorAxis: number;
	rotationInTurns: number;
	colorFill: string;
	colorBorder: string;

	constructor
	(
		semimajorAxis: number, semiminorAxis: number, rotationInTurns: number,
		colorFill: string, colorBorder: string
	)
	{
		this.semimajorAxis = semimajorAxis;
		this.semiminorAxis = semiminorAxis;
		this.rotationInTurns = rotationInTurns;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var drawableLoc = entity.locatable().loc;
		var drawableOrientation = drawableLoc.orientation;
		var drawableRotationInTurns = drawableOrientation.headingInTurns();
		display.drawEllipse
		(
			drawableLoc.pos,
			this.semimajorAxis, this.semiminorAxis,
			NumberHelper.wrapToRangeZeroOne(this.rotationInTurns + drawableRotationInTurns),
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
