
function VisualRay(length, color)
{
	this.length = length;
	this.color = color;

	// temps

	this.polar = new Polar(0, this.length);
	this.toPos = new Coords();
}

{
	VisualRay.prototype.draw = function(universe, display, drawable, loc)
	{
		this.polar.angleInTurns = loc.orientation.headingInTurns();

		this.polar.toCoords
		(
			this.toPos
		).add
		(
			loc.pos
		);

		display.drawLine
		(
			loc.pos,
			this.toPos,
			this.color
		);
	}
}
