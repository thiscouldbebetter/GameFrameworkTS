
class VisualCircle
{
	constructor(radius, colorFill, colorBorder)
	{
		this.radius = radius;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	draw(universe, world, display, entity)
	{
		display.drawCircle(entity.locatable.loc.pos, this.radius, this.colorFill, this.colorBorder);
	};
}
