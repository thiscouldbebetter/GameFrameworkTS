
class VisualText implements Visual
{
	_text: DataBinding<any, string>;
	colorFill: Color;
	colorBorder: Color;

	constructor(text: DataBinding<any, string>, colorFill: Color, colorBorder: Color)
	{
		this._text = text;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var text = this.text(universe, world, display, entity);
		display.drawText
		(
			text,
			display.fontHeightInPixels,
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
