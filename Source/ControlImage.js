
function ControlImage(name, pos, size, image)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.image = image;
}

{
	ControlImage.prototype.drawToDisplayAtLoc = function(display, drawLoc)
	{
		var drawPos = drawLoc.pos.add(this.pos);

		display.drawRectangle
		(
			drawPos, this.size,
			display.colorBack, display.colorFore
		);

		display.drawImage
		(
			this.image,
			drawPos,
			display.sizeInPixels // hack
		);
	}


}
