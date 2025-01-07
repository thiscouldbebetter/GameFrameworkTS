
namespace ThisCouldBeBetter.GameFramework
{

export class VisualCrosshairs implements Visual<VisualCrosshairs>
{
	numberOfLines: number;
	radiusOuter: number;
	radiusInner: number;
	color: Color;
	lineThickness: number;

	constructor
	(
		numberOfLines: number, radiusOuter: number, radiusInner: number,
		color: Color, lineThickness: number
	)
	{
		this.numberOfLines = numberOfLines || 4;
		this.radiusOuter = radiusOuter || 10;
		this.radiusInner = radiusInner || (this.radiusOuter / 2);
		this.color = color || Color.Instances().White;
		this.lineThickness = lineThickness || 1;
	}

	static fromRadiiOuterAndInner(radiusOuter: number, radiusInner: number)
	{
		return new VisualCrosshairs(null, radiusOuter, radiusInner, null, null);
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		display.drawCrosshairs
		(
			Locatable.of(entity).loc.pos,
			this.numberOfLines,
			this.radiusOuter,
			this.radiusInner,
			this.color,
			this.lineThickness
		);
	}

	// Clonable.

	clone(): VisualCrosshairs
	{
		return new VisualCrosshairs
		(
			this.numberOfLines, this.radiusOuter, this.radiusInner,
			this.color, this.lineThickness
		);
	}

	overwriteWith(other: VisualCrosshairs): VisualCrosshairs
	{
		this.numberOfLines = other.numberOfLines;
		this.radiusOuter = other.radiusOuter;
		this.radiusInner = other.radiusInner;
		this.color = other.color;
		this.lineThickness = other.lineThickness;
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualCrosshairs
	{
		return this; // todo
	}
}

}
