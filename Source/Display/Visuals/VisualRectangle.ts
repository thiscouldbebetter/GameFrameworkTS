
class VisualRectangle
{
	constructor(size, colorFill, colorBorder, isCentered)
	{
		this.size = size;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
		this.isCentered = (isCentered == null ? true : isCentered);

		this.sizeHalf = this.size.clone().half();

		this._drawPos = new Coords();
	}

	draw(universe, world,  display, entity)
	{
		var drawPos = this._drawPos.overwriteWith
		(
			entity.locatable.loc.pos
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
			drawPos, this.size, this.colorFill, this.colorBorder
		);
	};
}
