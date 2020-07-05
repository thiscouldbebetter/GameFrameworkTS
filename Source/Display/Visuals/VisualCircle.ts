
class VisualCircle
{
	radius: number;
	colorFill: any;
	colorBorder: any;

	constructor(radius, colorFill, colorBorder)
	{
		this.radius = radius;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	draw(universe, world, display, entity)
	{
		display.drawCircle(entity.locatable().loc.pos, this.radius, this.colorFill, this.colorBorder);
	};
}
