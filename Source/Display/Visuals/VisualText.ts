
namespace ThisCouldBeBetter.GameFramework
{

export class VisualText implements Visual
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
		shouldTextContextBeReset: boolean,
		heightInPixels: number,
		colorFill: Color,
		colorBorder: Color
	)
	{
		this._text = text;
		this.shouldTextContextBeReset = shouldTextContextBeReset || false;
		this.heightInPixels = heightInPixels || 10;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;

		this._universeWorldPlaceEntities = UniverseWorldPlaceEntities.create();
	}

	static fromTextAndColor(text: string, colorFill: Color): VisualText
	{
		return new VisualText
		(
			DataBinding.fromContext(text),
			false, // shouldTextContextBeReset
			null, // heightInPixels
			colorFill,
			null // colorBorder
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
			false, // areColorsReversed
			true, // isCentered
			null // widthMaxInPixels
		);
	}

	text(uwpe: UniverseWorldPlaceEntities, display: Display)
	{
		if (this.shouldTextContextBeReset)
		{
			this._universeWorldPlaceEntities.overwriteWith
			(
				uwpe
			);
			this._text.contextSet(this._universeWorldPlaceEntities);
		}

		var returnValue = this._text.get();

		return returnValue;
	}

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// transformable

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

}
