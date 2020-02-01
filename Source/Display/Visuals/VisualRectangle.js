
function VisualRectangle(size, colorFill, colorBorder)
{
	this.size = size;
	this.colorFill = colorFill;
	this.colorBorder = colorBorder;

	this.sizeHalf = this.size.clone().half();

	this._drawPos = new Coords();
}

{
	VisualRectangle.prototype.draw = function(universe, world,  display, entity)
	{
		var drawPos = this._drawPos.overwriteWith
		(
			entity.locatable.loc.pos
		).subtract
		(
			this.sizeHalf
		);

		display.drawRectangle
		(
			drawPos, this.size, this.colorFill, this.colorBorder
		);
	};
}
