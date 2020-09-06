
class VisualCircleGradient implements Visual
{
	radius: number;
	gradientFill: ValueBreakGroup;
	colorBorder: string;

	constructor(radius: number, gradientFill: ValueBreakGroup, colorBorder: string)
	{
		this.radius = radius;
		this.gradientFill = gradientFill;
		this.colorBorder = colorBorder;
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		display.drawCircleWithGradient
		(
			entity.locatable().loc.pos, this.radius, this.gradientFill, this.colorBorder
		);
	}

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
