
function VisualRay(length, color)
{
	this.length = length;
	this.color = color;

	// temps

	this.polar = new Polar(0, this.length);
	this.toPos = new Coords();
}

{
	VisualRay.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var drawableLoc = drawable.loc;
		var drawablePos = drawableLoc.pos;

		this.polar.azimuthInTurns = drawableLoc.orientation.headingInTurns();

		this.polar.toCoords
		(
			this.toPos
		).add
		(
			drawablePos
		);

		display.drawLine
		(
			drawablePos,
			this.toPos,
			this.color
		);
	};
}
