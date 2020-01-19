
function VisualText(text, colorFill, colorBorder)
{
	this._text = text;
	this.colorFill = colorFill;
	this.colorBorder = colorBorder;
}

{
	VisualText.prototype.draw = function(universe, world, display, entity)
	{
		var text = this.text(universe, world, display, entity);
		display.drawText
		(
			text,
			display.fontHeightInPixels,
			entity.Locatable.loc.pos,
			this.colorFill,
			this.colorBorder,
			false, // areColorsReversed
			true, // isCentered
			null // widthMaxInPixels
		);
	};

	VisualText.prototype.text = function(universe, world, display, entity)
	{
		return (this._text.get == null ? this._text : this._text.get(universe, world, display, entity) );
	};
}
