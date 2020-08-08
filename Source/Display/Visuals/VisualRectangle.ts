
class VisualRectangle implements Visual
{
	size: Coords;
	colorFill: Color;
	colorBorder: Color;
	isCentered: boolean;

	sizeHalf: Coords;

	_drawPos: Coords;

	constructor(size: Coords, colorFill: Color, colorBorder: Color, isCentered: boolean)
	{
		this.size = size;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
		this.isCentered = (isCentered == null ? true : isCentered);

		this.sizeHalf = this.size.clone().half();

		this._drawPos = new Coords(0, 0, 0);
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var drawPos = this._drawPos.overwriteWith
		(
			entity.locatable().loc.pos
		)

		if (this.isCentered)
		{
			drawPos.subtract(this.sizeHalf);
		}

		display.drawRectangle
		(
			drawPos, this.size,
			Color.systemColorGet(this.colorFill),
			Color.systemColorGet(this.colorBorder),
			null
		);
	};

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}
