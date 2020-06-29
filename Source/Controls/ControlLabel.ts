
class ControlLabel
{
	constructor(name, pos, size, isTextCentered, text, fontHeightInPixels)
	{
		this.name = name;
		this.pos = pos;
		this.size = size;
		this.isTextCentered = isTextCentered;
		this._text = text;
		this.fontHeightInPixels = fontHeightInPixels;

		// Helper variables.

		this._drawPos = new Coords();
	}

	static fromPosAndText(pos, text)
	{
		return new ControlLabel
		(
			null, //name
			pos,
			null, // size
			false, // isTextCentered
			text,
			10 // fontHeightInPixels
		);
	};

	style(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	};

	text()
	{
		return (this._text.get == null ? this._text : this._text.get() );
	};

	// drawable

	draw(universe, display, drawLoc)
	{
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = this.style(universe);
		var text = this.text();

		if (text != null)
		{
			var textAsLines = ("" + text).split("\n");
			var widthMaxInPixels = (this.size == null ? null : this.size.x);
			for (var i = 0; i < textAsLines.length; i++)
			{
				var textLine = textAsLines[i];
				display.drawText
				(
					textLine,
					this.fontHeightInPixels,
					drawPos,
					style.colorBorder,
					style.colorFill, // colorOutline
					null, // areColorsReversed
					this.isTextCentered,
					widthMaxInPixels
				);

				drawPos.y += this.fontHeightInPixels;
			}
		}
	};
}
