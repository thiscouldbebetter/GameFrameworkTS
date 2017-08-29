
function VisualCircle(color, radius)
{
	this.color = color;
	this.radius = radius;
}

{
	VisualCircle.prototype.drawToDisplayForDrawableAndLoc = function(display, drawable, loc)
	{
		display.drawCircle(loc.pos, this.radius, this.color, display.colorFore);
	}
}
