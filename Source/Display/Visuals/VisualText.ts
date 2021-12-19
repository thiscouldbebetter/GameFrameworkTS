
namespace ThisCouldBeBetter.GameFramework
{

export class VisualText implements Visual<VisualText>
{
	_text: DataBinding<any, string>;
	shouldTextContextBeReset: boolean;
	colorFill: Color;
	colorBorder: Color;
	heightInPixels: number;

	_universeWorldPlaceEntities: UniverseWorldPlaceEntities;

	constructor
	(
		text: DataBinding<any, string>,
		heightInPixels: number,
		colorFill: Color,
		colorBorder: Color
	)
	{
		this._text = text;
		this.heightInPixels = heightInPixels || 10;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;

		this._universeWorldPlaceEntities = UniverseWorldPlaceEntities.create();
	}

	static fromTextHeightAndColor(
		text: string, heightInPixels: number, colorFill: Color
	): VisualText
	{
		return new VisualText
		(
			DataBinding.fromContext(text),
			null, // heightInPixels
			colorFill,
			null // colorBorder
		);
	}

	static fromTextHeightAndColors
	(
		text: string, heightInPixels: number,
		colorFill: Color, colorBorder: Color
	): VisualText
	{
		return new VisualText
		(
			DataBinding.fromContext(text),
			null, // heightInPixels
			colorFill,
			colorBorder
		);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;

		var text = this.text(uwpe, display);
		display.drawText
		(
			text,
			this.heightInPixels,
			entity.locatable().loc.pos,
			this.colorFill,
			this.colorBorder,
			true, // isCenteredHorizontally
			true, // isCenteredVertically
			null // sizeMaxInPixels
		);
	}

	text(uwpe: UniverseWorldPlaceEntities, display: Display)
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
