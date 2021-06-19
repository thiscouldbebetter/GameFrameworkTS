
namespace ThisCouldBeBetter.GameFramework
{

export class VisualCircleGradient implements Visual
{
	radius: number;
	gradientFill: ValueBreakGroup;
	colorBorder: Color;

	constructor
	(
		radius: number, gradientFill: ValueBreakGroup, colorBorder: Color
	)
	{
		this.radius = radius;
		this.gradientFill = gradientFill;
		this.colorBorder = colorBorder;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		display.drawCircleWithGradient
		(
			entity.locatable().loc.pos, this.radius, this.gradientFill,
			this.colorBorder
		);
	}

	// Clonable.

	clone(): VisualCircleGradient
	{
		return this; // todo
	}

	overwriteWith(other: VisualCircleGradient): VisualCircleGradient
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

}
