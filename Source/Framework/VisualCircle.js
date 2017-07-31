
function VisualCircle(color, radius)
{
	this.color = color;
	this.radius = radius;
}

{
	VisualCircle.prototype.drawToDisplayAtLoc = function(display, loc, entity)
	{
		display.drawCircle(loc.pos, this.radius, this.color, display.colorFore);
	}
}
