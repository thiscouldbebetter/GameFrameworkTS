
function VisualCircle(radius, colorFill, colorBorder)
{
	this.radius = radius;
	this.colorFill = colorFill;
	this.colorBorder = colorBorder;
}

{
	VisualCircle.prototype.draw = function(universe, world, display, drawable)
	{
		display.drawCircle(drawable.loc.pos, this.radius, this.colorFill, this.colorBorder);
	}
}
