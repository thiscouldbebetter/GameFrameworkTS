
function VisualImage(imageName, size)
{
	this.imageName = imageName;
	this.size = size;
	
	this.sizeHalf = this.size.clone().divideScalar(2);
}

{
	VisualImage.prototype.image = function()
	{
		return Globals.Instance.mediaLibrary.imageGetByName(this.imageName);
	}
	
	// visual
	
	VisualImage.prototype.drawToDisplayAtLoc = function(display, loc, entity)
	{
		var image = this.image();
		var pos = loc.pos;
		var drawPos = display.drawPos;
		drawPos.overwriteWith(pos).subtract(this.sizeHalf);
		display.drawImage(image, drawPos, this.size);
	}
}
