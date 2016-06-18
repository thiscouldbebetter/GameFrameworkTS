
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

		Globals.Instance.displayHelper.drawControlImage(this);
	}
}
