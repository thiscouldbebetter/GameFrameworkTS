
class VisualImageImmediate implements VisualImage
{
	_image: Image2;

	_drawPos: Coords;

	constructor(image: Image2)
	{
		this._image = image;

		// Helper variables.

		this._drawPos = new Coords(0, 0, 0);
	}

	// static methods

	static manyFromImages(images: Image2[])
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

	image(universe: Universe): Image2
	{
		return this._image;
	};

	// visual

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var image = this.image(universe);
		var imageSize = image.sizeInPixels;
		var drawPos = this._drawPos.clear().subtract(imageSize).half().add
		(
			entity.locatable().loc.pos
		);
		//display.drawImageScaled(image, drawPos, imageSize);
		display.drawImage(image, drawPos);
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
