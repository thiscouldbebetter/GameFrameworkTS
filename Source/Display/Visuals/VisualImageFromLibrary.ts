
class VisualImageFromLibrary
{
	imageName: string;

	_drawPos: Coords;

	constructor(imageName)
	{
		this.imageName = imageName;

		// Helper variables.
		this._drawPos = new Coords(0, 0, 0);
	}

	// static methods

	static manyFromImages(images, imageSizeScaled)
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

	image(universe)
	{
		return universe.mediaLibrary.imageGetByName(this.imageName);
	};

	// visual

	draw(universe, world, display, entity)
	{
		var image = this.image(universe);
		var imageSize = this.image(universe).sizeInPixels;
		var drawPos = this._drawPos.clear().subtract(imageSize).half().add
		(
			entity.locatable().loc.pos
		);
		display.drawImageScaled(image, drawPos, imageSize);
	};
}
