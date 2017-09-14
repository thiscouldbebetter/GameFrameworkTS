
function VisualImage(imageName, sizeScaled)
{
	this.imageName = imageName;
	this._sizeScaled = sizeScaled;
}

{
	// static methods

	VisualImage.manyFromImages = function(images)
	{
		var returnValues = [];

		for (var i = 0; i < images.length; i++)
		{
			var image = images[i];
			var visual = new VisualImage(image.name);
			returnValues.push(visual);
		}

		return returnValues;
	}

	// instance methods

	VisualImage.prototype.image = function()
	{
		return Globals.Instance.mediaLibrary.imageGetByName(this.imageName);
	}

	VisualImage.prototype.imageSizeScaled = function()
	{
		return (this._sizeScaled == null ? this.image().sizeInPixels: this._sizeScaled);
	}

	// visual

	VisualImage.prototype.drawToDisplayForDrawableAndLoc = function(display, drawable, loc)
	{
		var image = this.image();
		var pos = loc.pos;
		var drawPos = display.drawPos;
		var imageSize = this.imageSizeScaled();
		drawPos.clear().subtract(imageSize).divideScalar(2).add(pos);
		display.drawImage(image, drawPos, imageSize);
	}
}
