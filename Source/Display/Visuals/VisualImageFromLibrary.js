
function VisualImageFromLibrary(imageName)
{
	this.imageName = imageName;

	// Helper variables.
	this._drawPos = new Coords();
}

{
	// static methods

	VisualImageFromLibrary.manyFromImages = function(images)
	{
		var returnValues = [];

		for (var i = 0; i < images.length; i++)
		{
			var image = images[i];
			var visual = new VisualImageFromLibrary(image.name);
			returnValues.push(visual);
		}

		return returnValues;
	};

	// instance methods

	VisualImageFromLibrary.prototype.image = function(universe)
	{
		return universe.mediaLibrary.imageGetByName(this.imageName);
	};

	// visual

	VisualImageFromLibrary.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var image = this.image(universe);
		var imageSize = this.image(universe).sizeInPixels;
		var drawPos = this._drawPos.clear().subtract(imageSize).half().add
		(
			drawable.loc.pos
		);
		display.drawImageScaled(image, drawPos, imageSize);
	};
}
