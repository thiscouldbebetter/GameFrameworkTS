
function VisualEllipse(semimajorAxis, semiminorAxis, rotationInTurns, colorFill, colorBorder)
{
	this.semimajorAxis = semimajorAxis;
	this.semiminorAxis = semiminorAxis;
	this.rotationInTurns = rotationInTurns;
	this.colorFill = colorFill;
	this.colorBorder = colorBorder;
}

{
	VisualEllipse.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var drawableLoc = drawable.loc;
		display.drawEllipse
		(
			drawableLoc.pos,
			this.semimajorAxis, this.semiminorAxis,
			this.rotationInTurns,
			this.colorFill, this.colorBorder
		);
	};
}
