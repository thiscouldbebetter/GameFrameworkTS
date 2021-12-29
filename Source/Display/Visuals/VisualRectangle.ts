
namespace ThisCouldBeBetter.GameFramework
{

export class VisualRectangle implements Visual<VisualRectangle>
{
	size: Coords;
	colorFill: Color;
	colorBorder: Color;
	isCentered: boolean;

	sizeHalf: Coords;

	_drawPos: Coords;

	constructor
	(
		size: Coords,
		colorFill: Color,
		colorBorder: Color,
		isCentered: boolean
	)
	{
		this.size = size;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
		this.isCentered = isCentered || true;

		this.sizeHalf = this.size.clone().half();

		this._drawPos = Coords.create();
	}

	static default(): VisualRectangle
	{
		// For rapid prototyping.
		return new VisualRectangle(Coords.fromXY(10, 10), null, Color.byName("Cyan"), true);
	}

	static fromSizeAndColorFill(size: Coords, colorFill: Color): VisualRectangle
	{
		return new VisualRectangle(size, colorFill, null, null);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
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
			drawPos, this.size, this.colorFill, this.colorBorder
		);
	}

	// Clonable.

	clone(): VisualRectangle
	{
		return this; // todo
	}

	overwriteWith(other: VisualRectangle): VisualRectangle
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualRectangle
	{
		return this; // todo
	}
}

}
