
function VisualRectangle(size, colorFill, colorBorder)
{
	this.size = size;
	this.colorFill = colorFill;
	this.colorBorder = colorBorder;

	this.sizeHalf = this.size.clone().divideScalar(2);
}

{
	VisualRectangle.prototype.drawToDisplayForDrawableAndLoc = function(display, drawable, loc)
	{
		var pos = loc.pos;
		var drawPos = display.drawPos;
		drawPos.overwriteWith(pos).subtract(this.sizeHalf);
		display.drawRectangle
		(
			drawPos, this.size, this.colorFill, this.colorBorder
		);
	}
}
