
namespace ThisCouldBeBetter.GameFramework
{

export class ControlLabel<TContext> extends ControlBase
{
	isTextCenteredHorizontally: boolean;
	isTextCenteredVertically: boolean;
	_text: DataBinding<TContext,string>;

	parent: ControlBase;

	_drawPos: Coords;

	constructor
	(
		name: string,
		pos: Coords,
		size: Coords,
		isTextCenteredHorizontally: boolean,
		isTextCenteredVertically: boolean,
		text: DataBinding<TContext, string>,
		fontHeightInPixels: number
	)
	{
		super(name, pos, size, fontHeightInPixels);
		this.isTextCenteredHorizontally = isTextCenteredHorizontally;
		this.isTextCenteredVertically = isTextCenteredVertically;
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
			false, // isTextCenteredHorizontally
			false, // isTextCenteredVertically
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
			display.drawText
			(
				text,
				this.fontHeightInPixels,
				drawPos,
				style.colorBorder(),
				style.colorFill(), // colorOutline
				this.isTextCenteredHorizontally,
				this.isTextCenteredVertically,
				this.size
			);

		}
	}
}

}
