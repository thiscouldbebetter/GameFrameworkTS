
namespace ThisCouldBeBetter.GameFramework
{

export class VisualText implements Visual<VisualText>
{
	_text: DataBinding<any, string>;
	colorFill: Color;
	colorBorder: Color;
	fontNameAndHeight: FontNameAndHeight;

	_universeWorldPlaceEntities: UniverseWorldPlaceEntities;

	constructor
	(
		text: DataBinding<any, string>,
		fontNameAndHeight: FontNameAndHeight,
		colorFill: Color,
		colorBorder: Color
	)
	{
		this._text = text;
		this.fontNameAndHeight =
			fontNameAndHeight || FontNameAndHeight.default();
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;

		this._universeWorldPlaceEntities = UniverseWorldPlaceEntities.create();
	}

	static fromTextBindingFontAndColor
	(
		textBinding: DataBinding<any, string>,
		font: FontNameAndHeight,
		colorFill: Color
	): VisualText
	{
		return new VisualText
		(
			textBinding,
			font,
			colorFill,
			null // colorBorder
		);
	}

	static fromTextBindingFontAndColorsFillAndBorder
	(
		textBinding: DataBinding<any, string>,
		font: FontNameAndHeight,
		colorFill: Color,
		colorBorder: Color
	): VisualText
	{
		return new VisualText
		(
			textBinding,
			font,
			colorFill,
			colorBorder
		);
	}

	static fromTextImmediateFontAndColor
	(
		text: string,
		font: FontNameAndHeight,
		colorFill: Color
	): VisualText
	{
		return new VisualText
		(
			DataBinding.fromContext(text),
			font,
			colorFill,
			null // colorBorder
		);
	}

	static fromTextImmediateFontAndColorsFillAndBorder
	(
		text: string,
		font: FontNameAndHeight,
		colorFill: Color,
		colorBorder: Color
	): VisualText
	{
		return new VisualText
		(
			DataBinding.fromContext(text),
			font,
			colorFill,
			colorBorder
		);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;

		var contextOld = this._text.context;
		if
		(
			contextOld == null
			|| contextOld.constructor.name == UniverseWorldPlaceEntities.name
		)
		{
			this._text.contextSet(uwpe);
		}

		var text = this.text();

		display.drawText
		(
			text,
			this.fontNameAndHeight,
			entity.locatable().loc.pos,
			this.colorFill,
			this.colorBorder,
			true, // isCenteredHorizontally
			true, // isCenteredVertically
			null // sizeMaxInPixels
		);
	}

	text(): string
	{
		var returnValue = this._text.get();

		return returnValue;
	}

	// Clonable.

	clone(): VisualText
	{
		return this; // todo
	}

	overwriteWith(other: VisualText): VisualText
	{
		return this; // todo
	}

	// transformable

	transform(transformToApply: TransformBase): VisualText
	{
		return this; // todo
	}
}

}
