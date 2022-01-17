
namespace ThisCouldBeBetter.GameFramework
{

export class VisualCircleGradient implements Visual<VisualCircleGradient>
{
	radius: number;
	gradientFill: ValueBreakGroup<Color>;
	colorBorder: Color;

	constructor
	(
		radius: number,
		gradientFill: ValueBreakGroup<Color>,
		colorBorder: Color
	)
	{
		this.radius = radius;
		this.gradientFill = gradientFill;
		this.colorBorder = colorBorder;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		var drawPos = entity.locatable().loc.pos;
		display.drawCircleWithGradient
		(
			drawPos, this.radius, this.gradientFill, this.colorBorder
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

	transform(transformToApply: TransformBase): VisualCircleGradient
	{
		return this; // todo
	}
}

}
