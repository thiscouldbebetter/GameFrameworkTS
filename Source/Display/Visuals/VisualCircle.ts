
class VisualCircle implements Visual
{
	radius: number;
	colorFill: string;
	colorBorder: string;

	constructor(radius: number, colorFill: string, colorBorder: string)
	{
		this.radius = radius;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		display.drawCircle(entity.locatable().loc.pos, this.radius, this.colorFill, this.colorBorder);
	};

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}
