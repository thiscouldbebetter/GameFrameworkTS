
class VisualRectangle implements Visual
{
	size: Coords;
	colorFill: string;
	colorBorder: string;
	isCentered: boolean;

	sizeHalf: Coords;

	_drawPos: Coords;

	constructor(size: Coords, colorFill: string, colorBorder: string, isCentered: boolean)
	{
		this.size = size;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
		this.isCentered = (isCentered == null ? true : isCentered);

		this.sizeHalf = this.size.clone().half();

		this._drawPos = new Coords(0, 0, 0);
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var drawPos = this._drawPos.overwriteWith
		(
			entity.locatable().loc.pos
		)

		if (this.isCentered)
		{
			drawPos.subtract
			(
				this.sizeHalf
			);
		}

		display.drawRectangle
		(
			drawPos, this.size, this.colorFill, this.colorBorder, null
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
