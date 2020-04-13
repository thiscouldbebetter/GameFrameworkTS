
class VisualCircleGradient
{
	constructor(radius, gradientFill, colorBorder)
	{
		this.radius = radius;
		this.gradientFill = gradientFill;
		this.colorBorder = colorBorder;
	}

	draw(universe, world, display, entity)
	{
		display.drawCircleWithGradient
		(
			entity.locatable.loc.pos, this.radius, this.gradientFill, this.colorBorder
		);
	};
}
