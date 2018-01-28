
function VisualImage(imageName, sizeScaled)
{
	this.imageName = imageName;
	this._sizeScaled = sizeScaled;

	// Helper variables.
	this.drawPos = new Coords();
}

{
	// static methods

	VisualImage.manyFromImages = function(images, imageSizeScaled)
	{
		var returnValues = [];

		for (var i = 0; i < images.length; i++)
		{
			var image = images[i];
			var visual = new VisualImage(image.name, imageSizeScaled);
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

	VisualImage.prototype.draw = function(universe, world, display, drawable)
	{
		var image = this.image(universe);
		var imageSize = this.imageSizeScaled(universe);
		var drawPos = this.drawPos.clear().subtract(imageSize).half().add
		(
			drawable.loc.pos
		);
		display.drawImage(image, drawPos, imageSize);
	}
}
