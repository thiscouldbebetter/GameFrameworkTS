
namespace ThisCouldBeBetter.GameFramework
{

export class ControlLabel<TContext> extends ControlBase
{
	isTextCentered: boolean;
	_text: DataBinding<TContext,string>;

	parent: ControlBase;

	_drawPos: Coords;

	constructor
	(
		name: string,
		pos: Coords,
		size: Coords,
		isTextCentered: boolean,
		text: DataBinding<TContext, string>,
		fontHeightInPixels: number
	)
	{
		super(name, pos, size, fontHeightInPixels);
		this.isTextCentered = isTextCentered;
		this._text = text;

		// Helper variables.

		this._drawPos = Coords.create();
	}

	static fromPosHeightAndText<TContext>
	(
		pos: Coords,
		fontHeightInPixels: number,
		text: DataBinding<TContext, string>
	): ControlLabel<TContext>
	{
		return new ControlLabel
		(
			null, //name
			pos,
			null, // size
			false, // isTextCentered
			text,
			fontHeightInPixels
		);
	}

	actionHandle(actionName: string): boolean
	{
		return false; // wasActionHandled
	}

	isEnabled(): boolean
	{
		return false;
	}

	mouseClick(pos: Coords): boolean
	{
		return false;
	}

	scalePosAndSize(scaleFactor: Coords): void
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
	}

	text(): string
	{
		return this._text.get();
	}

	// drawable

	draw
	(
		universe: Universe,
		display: Display,
		drawLoc: Disposition,
		style: ControlStyle
	): void
	{
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = style || this.style(universe);
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
					style.colorBorder(),
					style.colorFill(), // colorOutline
					this.isTextCentered,
					widthMaxInPixels
				);

				drawPos.y += this.fontHeightInPixels;
			}
		}
	}
}

}
