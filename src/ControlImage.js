
function ControlImage(name, pos, size, imageSrc)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.imageSrc = imageSrc;
}

{
	ControlImage.prototype.draw = function()
	{
		if (this.systemImage == null)
		{
			this.systemImage = document.createElement("img");
			this.systemImage.src = this.imageSrc;
		}
		
		var controlImage = this;
		var display = Globals.Instance.display;

		var pos = controlImage.pos;
		var size = controlImage.size;

		display.drawRectangle
		(
			pos, size, display.colorBack, display.colorFore
		)

		display.graphics.drawImage
		(
			controlImage.systemImage,
			pos.x, pos.y,
			display.sizeInPixels.x, display.sizeInPixels.y
		);
	}


}
