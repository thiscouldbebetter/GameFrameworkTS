
namespace ThisCouldBeBetter.GameFramework
{

export class VisualCircle implements Visual
{
	radius: number;
	colorFill: Color;
	colorBorder: Color;
	borderThickness: number;

	constructor(radius: number, colorFill: Color, colorBorder: Color, borderThickness: number)
	{
		this.radius = radius;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
		this.borderThickness = borderThickness || 1;
	}

	static fromRadiusAndColorFill(radius: number, colorFill: Color): VisualCircle
	{
		return new VisualCircle(radius, colorFill, null, null);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		display.drawCircle
		(
			entity.locatable().loc.pos,
			this.radius,
			this.colorFill,
			this.colorBorder,
			this.borderThickness
		);
	}

	// Clonable.

	clone(): Visual
	{
		return new VisualCircle
		(
			this.radius, this.colorFill, this.colorBorder, this.borderThickness
		);
	}

	overwriteWith(otherAsVisual: Visual): Visual
	{
		var other = otherAsVisual as VisualCircle;
		this.radius = other.radius;
		this.colorFill = other.colorFill;
		this.colorBorder = other.colorBorder;
		this.borderThickness = other.borderThickness;
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

}
