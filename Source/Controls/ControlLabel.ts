
namespace ThisCouldBeBetter.GameFramework
{

export class ControlLabel<TContext> extends ControlBase
{
	isTextCenteredHorizontally: boolean;
	isTextCenteredVertically: boolean;
	_text: DataBinding<TContext, string>;

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

	static fromPosAndText<TContext>
	(
		pos: Coords,
		text: DataBinding<TContext, string>
	): ControlLabel<TContext>
	{
		var fontNameAndHeight = FontNameAndHeight.default();
		var fontHeightInPixels = fontNameAndHeight.heightInPixels;
		var size = Coords.fromXY(100, 1).multiplyScalar(fontHeightInPixels);

		return new ControlLabel<TContext>
		(
			ControlLabel.name + "_" + text.get(), //name
			pos,
			size,
			false, // isTextCenteredHorizontally
			false, // isTextCenteredVertically
			text,
			fontNameAndHeight
		);
	}

	static fromPosAndTextString<TContext>
	(
		pos: Coords,
		textAsString: string
	): ControlLabel<TContext>
	{
		var fontNameAndHeight = FontNameAndHeight.default();
		var fontHeightInPixels = fontNameAndHeight.heightInPixels;
		var size = Coords.fromXY(100, 1).multiplyScalar(fontHeightInPixels);
		var text = DataBinding.fromGet((c: TContext) => textAsString);

		return new ControlLabel<TContext>
		(
			ControlLabel.name + "_" + textAsString, //name
			pos,
			size,
			false, // isTextCenteredHorizontally
			false, // isTextCenteredVertically
			text,
			fontNameAndHeight
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

	static fromPosSizeTextFontCentered<TContext> 
	(
		pos: Coords,
		size: Coords,
		text: DataBinding<TContext, string>,
		fontNameAndHeight: FontNameAndHeight
	): ControlLabel<TContext>
	{
		var textFromBindingInitial = text.get() || "";

		return new ControlLabel
		(
			"label" + textFromBindingInitial.split(" ").join(""),
			pos,
			size,
			true, // isTextCenteredHorizontally
			true, // isTextCenteredVertically
			text,
			fontNameAndHeight
		)
	}

	static fromPosSizeTextFontCenteredHorizontally<TContext> 
	(
		pos: Coords,
		size: Coords,
		text: DataBinding<TContext, string>,
		fontNameAndHeight: FontNameAndHeight
	): ControlLabel<TContext>
	{
		var textFromBindingInitial = text.get() || "";

		return new ControlLabel
		(
			"label" + textFromBindingInitial.split(" ").join(""),
			pos,
			size,
			true, // isTextCenteredHorizontally
			false, // isTextCenteredVertically
			text,
			fontNameAndHeight
		)
	}

	static fromPosSizeTextFontUncentered<TContext> 
	(
		pos: Coords,
		size: Coords,
		text: DataBinding<TContext, string>,
		fontNameAndHeight: FontNameAndHeight
	): ControlLabel<TContext>
	{
		var textFromBindingInitial = text.get() || "";

		return new ControlLabel
		(
			"label" + textFromBindingInitial.split(" ").join(""),
			pos,
			size,
			false, // isTextCenteredHorizontally
			false, // isTextCenteredVertically
			text,
			fontNameAndHeight
		)
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
