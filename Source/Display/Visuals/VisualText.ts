
class VisualText implements Visual
{
	_text: DataBinding<any, string>;
	colorFill: Color;
	colorBorder: Color;
	heightInPixels: number;

	constructor(text: DataBinding<any, string>, heightInPixels: number, colorFill: Color, colorBorder: Color)
	{
		this._text = text;
		this.heightInPixels = heightInPixels || 10;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var text = this.text(universe, world, display, entity);
		display.drawText
		(
			text,
			this.heightInPixels,
			entity.locatable().loc.pos,
			Color.systemColorGet(this.colorFill),
			Color.systemColorGet(this.colorBorder),
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
