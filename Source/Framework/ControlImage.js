
function ControlImage(name, pos, size, image)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.image = image;
}

{
	ControlImage.prototype.draw = function()
	{
		var display = Globals.Instance.display;

		display.drawRectangle
		(
			this.pos, this.size, display.colorBack, display.colorFore
		)

		display.drawImage
		(
			this.image,
			this.pos,
			display.sizeInPixels // hack
		);
	}


}
