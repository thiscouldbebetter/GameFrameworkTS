
namespace ThisCouldBeBetter.GameFramework
{

export class VisualCircle implements Visual<VisualCircle>
{
	radius: number;
	colorFill: Color;
	colorBorder: Color;
	borderThickness: number;

	constructor
	(
		radius: number,
		colorFill: Color,
		colorBorder: Color,
		borderThickness: number
	)
	{
		this.radius = radius;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
		this.borderThickness = borderThickness || 1;
	}

	static default(): VisualCircle
	{
		// Convenience method for rapid prototyping.
		return new VisualCircle(10, null, Color.Instances().Cyan, null);
	}

	static fromRadiusAndColorBorder(radius: number, colorBorder: Color): VisualCircle
	{
		return new VisualCircle(radius, null, colorBorder, null);
	}

	static fromRadiusAndColorFill(radius: number, colorFill: Color): VisualCircle
	{
		return new VisualCircle(radius, colorFill, null, null);
	}

	static fromRadiusAndColors
	(
		radius: number, colorFill: Color, colorBorder: Color
	): VisualCircle
	{
		return new VisualCircle(radius, colorFill, colorBorder, null);
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
		display.drawCircle
		(
			Locatable.of(entity).loc.pos,
			this.radius,
			this.colorFill,
			this.colorBorder,
			this.borderThickness
		);
	}

	// Clonable.

	clone(): VisualCircle
	{
		return new VisualCircle
		(
			this.radius, this.colorFill, this.colorBorder, this.borderThickness
		);
	}

	overwriteWith(other: VisualCircle): VisualCircle
	{
		this.radius = other.radius;
		this.colorFill = other.colorFill;
		this.colorBorder = other.colorBorder;
		this.borderThickness = other.borderThickness;
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualCircle
	{
		return this; // todo
	}
}

}
