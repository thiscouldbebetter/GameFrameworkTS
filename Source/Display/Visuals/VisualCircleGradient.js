
function VisualCircleGradient(radius, gradientFill, colorBorder)
{
	this.radius = radius;
	this.gradientFill = gradientFill;
	this.colorBorder = colorBorder;
}

{
	VisualCircleGradient.prototype.draw = function(universe, world, display, entity)
	{
		display.drawCircleWithGradient
		(
			entity.locatable.loc.pos, this.radius, this.gradientFill, this.colorBorder
		);
	};
}
