
function ControlImage(name, pos, size, image)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.image = image;
}

{
	ControlImage.prototype.style = function()
	{
		return ControlStyle.Instances[this.styleName == null ? "Default" : this.styleName];
	}

	// drawable

	ControlImage.prototype.drawToDisplayAtLoc = function(display, drawLoc)
	{
		var drawPos = drawLoc.pos.add(this.pos);
		var style = this.style();

		display.drawRectangle
		(
			drawPos, this.size,
			style.colorFill, style.colorBorder
		);

		display.drawImage
		(
			this.image,
			drawPos,
			display.sizeInPixels // hack
		);
	}
}
