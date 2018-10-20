
function VisualImageImmediate(image, sizeScaled)
{
	this.image = image;

	// Helper variables.

	this._drawPos = new Coords();
}

{
	// static methods

	VisualImageImmediate.manyFromImages = function(images, imageSizeScaled)
	{
		var returnValues = [];

		for (var i = 0; i < images.length; i++)
		{
			var image = images[i];
			var visual = new VisualImageImmediate(image, imageSizeScaled);
			returnValues.push(visual);
		}

		return returnValues;
	}

	// instance methods

	VisualImageImmediate.prototype.imageSizeScaled = function(universe)
	{
		return (this._sizeScaled == null ? this.image.sizeInPixels: this._sizeScaled);
	}

	// visual

	VisualImageImmediate.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var image = this.image;
		var imageSize = this.imageSizeScaled(universe);
		var drawPos = this._drawPos.clear().subtract(imageSize).half().add
		(
			drawable.loc.pos
		);
		display.drawImage(image, drawPos, imageSize);
	}
}
