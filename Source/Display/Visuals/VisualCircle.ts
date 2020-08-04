
class VisualCircle implements Visual
{
	radius: number;
	colorFill: Color;
	colorBorder: Color;

	constructor(radius: number, colorFill: Color, colorBorder: Color)
	{
		this.radius = radius;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		display.drawCircle
		(
			entity.locatable().loc.pos, this.radius,
			( this.colorFill == null ? null : this.colorFill.systemColor() ),
			( this.colorBorder == null ? null : this.colorBorder.systemColor() )
		);
	};

	// Clonable.

	clone(): Visual
	{
		return new VisualCircle(this.radius, this.colorFill, this.colorBorder );
	}

	overwriteWith(other: Visual): Visual
	{
		var otherAsVisualCircle = other as VisualCircle;
		this.radius = otherAsVisualCircle.radius;
		this.colorFill = otherAsVisualCircle.colorFill;
		this.colorBorder = otherAsVisualCircle.colorBorder;
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}
