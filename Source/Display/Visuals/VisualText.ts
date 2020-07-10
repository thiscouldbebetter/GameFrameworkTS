
class VisualText implements Visual
{
	_text: DataBinding<any, string>;
	colorFill: string;
	colorBorder: string;

	constructor(text: DataBinding<any, string>, colorFill: string, colorBorder: string)
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
			this.colorFill,
			this.colorBorder,
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
