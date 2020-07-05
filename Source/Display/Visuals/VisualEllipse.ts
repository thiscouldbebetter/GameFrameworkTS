
class VisualEllipse
{
	semimajorAxis: number;
	semiminorAxis: number;
	rotationInTurns: number;
	colorFill: any;
	colorBorder: any;

	constructor(semimajorAxis, semiminorAxis, rotationInTurns, colorFill, colorBorder)
	{
		this.semimajorAxis = semimajorAxis;
		this.semiminorAxis = semiminorAxis;
		this.rotationInTurns = rotationInTurns;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	draw(universe, world, display, entity)
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
}
