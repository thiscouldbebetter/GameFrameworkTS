
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
		fontNameAndHeight: FontNameAndHeight
	)
	{
		super(name, pos, size, fontNameAndHeight);
		this.isTextCenteredHorizontally = isTextCenteredHorizontally;
		this.isTextCenteredVertically = isTextCenteredVertically;
		this._text = text;

		// Helper variables.

		this._drawPos = Coords.create();
	}

	static fromPosAndTextString<TContext>
	(
		pos: Coords,
		textAsString: string
	): ControlLabel<TContext>
	{
		return new ControlLabel<TContext>
		(
			null, //name
			pos,
			null, // size
			false, // isTextCenteredHorizontally
			false, // isTextCenteredVertically
			DataBinding.fromGet((c: TContext) => textAsString),
			FontNameAndHeight.default()
		);
	}

	static fromPosHeightAndText<TContext>
	(
		pos: Coords,
		fontNameAndHeight: FontNameAndHeight,
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
			fontNameAndHeight
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
				this.fontNameAndHeight,
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
