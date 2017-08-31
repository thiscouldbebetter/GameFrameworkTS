
function VisualCircle(radius, colorFill, colorBorder)
{
	this.radius = radius;
	this.colorFill = colorFill;
	this.colorBorder = colorBorder;
}

{
	VisualCircle.prototype.drawToDisplayForDrawableAndLoc = function(display, drawable, loc)
	{
		display.drawCircle(loc.pos, this.radius, this.colorFill, this.colorBorder);
	}
}
