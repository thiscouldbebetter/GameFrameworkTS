
function VisualRectangle(size, colorFill, colorBorder)
{
	this.size = size;
	this.colorFill = colorFill;
	this.colorBorder = colorBorder;

	this.sizeHalf = this.size.clone().half();

	this.drawPos = new Coords();
}

{
	VisualRectangle.prototype.draw = function(universe, world,  display, drawable)
	{
		var drawPos = this.drawPos.overwriteWith
		(
			drawable.loc.pos
		).subtract
		(
			this.sizeHalf
		);

		display.drawRectangle
		(
			drawPos, this.size, this.colorFill, this.colorBorder
		);
	}
}
