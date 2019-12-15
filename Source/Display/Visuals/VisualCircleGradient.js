
function VisualCircleGradient(radius, gradientFill, colorBorder)
{
	this.radius = radius;
	this.gradientFill = gradientFill;
	this.colorBorder = colorBorder;
}

{
	VisualCircleGradient.prototype.draw = function(universe, world, display, drawable, entity)
	{
		display.drawCircleWithGradient
		(
			entity.Locatable.loc.pos, this.radius, this.gradientFill, this.colorBorder
		);
	};
}
