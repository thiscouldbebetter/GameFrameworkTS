
class VisualImageImmediate
{
	constructor(image)
	{
		this._image = image;

		// Helper variables.

		this._drawPos = new Coords();
	}

	// static methods

	static manyFromImages(images)
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

	image()
	{
		return this._image;
	};

	// clone

	clone()
	{
		return this; // todo
	};

	// visual

	draw(universe, world, display, entity)
	{
		var image = this.image();
		var imageSize = image.sizeInPixels;
		var drawPos = this._drawPos.clear().subtract(imageSize).half().add
		(
			entity.locatable.loc.pos
		);
		//display.drawImageScaled(image, drawPos, imageSize);
		display.drawImage(image, drawPos);
	};
}
