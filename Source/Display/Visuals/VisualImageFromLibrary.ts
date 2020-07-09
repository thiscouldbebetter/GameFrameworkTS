
class VisualImageFromLibrary implements VisualImage
{
	imageName: string;

	_drawPos: Coords;

	constructor(imageName: string)
	{
		this.imageName = imageName;

		// Helper variables.
		this._drawPos = new Coords(0, 0, 0);
	}

	// static methods

	static manyFromImages(images: Image2[], imageSizeScaled: Coords)
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

	image(universe: Universe): Image2
	{
		return universe.mediaLibrary.imageGetByName(this.imageName);
	};

	// visual

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var image = this.image(universe);
		var imageSize = this.image(universe).sizeInPixels;
		var drawPos = this._drawPos.clear().subtract(imageSize).half().add
		(
			entity.locatable().loc.pos
		);
		display.drawImageScaled(image, drawPos, imageSize);
	};

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}
