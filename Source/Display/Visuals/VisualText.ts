
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

	draw
	(
		universe: Universe, world: World, place: Place,
		entity: Entity, display: Display
	)
	{
		var text = this.text(universe, world, place, entity, display);
		display.drawText
		(
			text,
			this.heightInPixels,
			entity.locatable().loc.pos,
			Color.systemColorGet(this.colorFill),
			Color.systemColorGet(this.colorBorder),
			false, // areColorsReversed
			true, // isCentered
			null // widthMaxInPixels
		);
	}

	text
	(
		universe: Universe, world: World, place: Place,
		entity: Entity, display: Display
	)
	{
		if (this.shouldTextContextBeReset)
		{
			this._universeWorldPlaceEntities.fieldsSet
			(
				universe, world, place, entity, null
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
