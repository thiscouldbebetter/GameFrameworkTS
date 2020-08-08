
class VisualText implements Visual
{
	_text: DataBinding<any, string>;
	colorFill: Color;
	colorBorder: Color;
	heightInPixels: number;

	constructor(text: DataBinding<any, string>, heightInPixels: number, colorFill: Color, colorBorder: Color)
	{
		this._text = text;
		this.heightInPixels = heightInPixels;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var text = this.text(universe, world, display, entity);
		display.drawText
		(
			text,
			this.heightInPixels || display.fontHeightInPixels,
			entity.locatable().loc.pos,
			(this.colorFill == null ? null : this.colorFill.systemColor() ),
			(this.colorBorder == null ? null : this.colorBorder.systemColor() ),
			false, // areColorsReversed
			true, // isCentered
			null // widthMaxInPixels
		);
	};

	text(universe: Universe, world: World, display: Display, entity: Entity)
	{
		return this._text.get();
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

	// transformable

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}
