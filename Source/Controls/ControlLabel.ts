
class ControlLabel extends ControlBase
{
	isTextCentered: boolean;
	_text: any;

	parent: ControlBase;
	styleName: string;

	_drawPos: Coords;

	constructor
	(
		name: string, pos: Coords, size: Coords, isTextCentered: boolean,
		text: any, fontHeightInPixels: number
	)
	{
		super(name, pos, size, fontHeightInPixels);
		this.isTextCentered = isTextCentered;
		this._text = text;

		// Helper variables.

		this._drawPos = new Coords(0, 0, 0);
	}

	static fromPosAndText(pos: Coords, text: any)
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

	actionHandle(actionName: string)
	{
		return false; // wasActionHandled
	}

	isEnabled()
	{
		return false;
	}

	mouseClick(pos: Coords): boolean
	{
		return false;
	}

	scalePosAndSize(scaleFactor: Coords)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
	}

	text()
	{
		return (this._text.get == null ? this._text : this._text.get() );
	}

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition)
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
					Color.systemColorGet(style.colorBorder),
					Color.systemColorGet(style.colorFill), // colorOutline
					null, // areColorsReversed
					this.isTextCentered,
					widthMaxInPixels
				);

				drawPos.y += this.fontHeightInPixels;
			}
		}
	}
}
