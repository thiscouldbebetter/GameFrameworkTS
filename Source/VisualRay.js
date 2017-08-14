
function VisualRay(color, length)
{
	this.color = color;
	this.length = length;

	// temps

	this.polar = new Polar(0, this.length);
	this.toPos = new Coords();
}

{
	VisualRay.prototype.drawToDisplayForDrawableAndLoc = function(display, drawable, loc)
	{
		this.polar.angleInCycles = loc.heading;

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
