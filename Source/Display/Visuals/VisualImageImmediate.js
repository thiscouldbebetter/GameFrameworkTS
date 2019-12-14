
function VisualImageImmediate(image)
{
	this._image = image;

	// Helper variables.

	this._drawPos = new Coords();
}

{
	// static methods

	VisualImageImmediate.manyFromImages = function(images)
	{
		var returnValues = [];

		for (var i = 0; i < images.length; i++)
		{
			var image = images[i];
			var visual = new VisualImageImmediate(image);
			returnValues.push(visual);
		}

		return returnValues;
	};

	// instance methods

	VisualImageImmediate.prototype.image = function()
	{
		return this._image;
	};

	// clone

	VisualImageImmediate.prototype.clone = function()
	{
		return this; // todo
	};

	// visual

	VisualImageImmediate.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var image = this.image();
		var imageSize = image.sizeInPixels;
		var drawPos = this._drawPos.clear().subtract(imageSize).half().add
		(
			drawable.loc.pos
		);
		display.drawImageScaled(image, drawPos, imageSize);
	};
}
