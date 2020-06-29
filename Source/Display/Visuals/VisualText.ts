
class VisualText
{
	constructor(text, colorFill, colorBorder)
	{
		this._text = text;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	draw(universe, world, display, entity)
	{
		var text = this.text(universe, world, display, entity);
		display.drawText
		(
			text,
			display.fontHeightInPixels,
			entity.locatable.loc.pos,
			this.colorFill,
			this.colorBorder,
			false, // areColorsReversed
			true, // isCentered
			null // widthMaxInPixels
		);
	};

	text(universe, world, display, entity)
	{
		return (this._text.get == null ? this._text : this._text.get(universe, world, display, entity) );
	};
}
