
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

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return true;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		var drawPos = Locatable.of(entity).loc.pos;
		display.drawCircleWithGradient
		(
			drawPos, this.radius, this.gradientFill, this.colorBorder
		);
	}

	// Clonable.

	clone(): VisualCircleGradient
	{
		return new VisualCircleGradient
		(
			this.radius,
			this.gradientFill,
			this.colorBorder
		);
	}

	overwriteWith(other: VisualCircleGradient): VisualCircleGradient
	{
		this.radius = other.radius;
		this.gradientFill = other.gradientFill;
		this.colorBorder = other.colorBorder;
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualCircleGradient
	{
		return this; // todo
	}
}

}
