
function VisualImage(imageName, sizeScaled)
{
	this.imageName = imageName;
	this._sizeScaled = sizeScaled;

	// Helper variables.
	this.drawPos = new Coords();
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

	VisualImage.prototype.image = function(universe)
	{
		return universe.mediaLibrary.imageGetByName(this.imageName);
	}

	VisualImage.prototype.imageSizeScaled = function(universe)
	{
		return (this._sizeScaled == null ? this.image(universe).sizeInPixels: this._sizeScaled);
	}

	// visual

	VisualImage.prototype.draw = function(universe, display, drawable, loc)
	{
		var image = this.image(universe);
		var pos = loc.pos;
		var imageSize = this.imageSizeScaled(universe);
		var drawPos = this.drawPos.clear().subtract(imageSize).half().add(pos);
		display.drawImage(image, drawPos, imageSize);
	}
}
