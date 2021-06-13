
namespace ThisCouldBeBetter.GameFramework
{

export class VisualImageImmediate implements VisualImage
{
	_image: Image2;
	isScaled: boolean

	_drawPos: Coords;

	constructor(image: Image2, isScaled: boolean)
	{
		this._image = image;
		this.isScaled = isScaled || false;

		// Helper variables.

		this._drawPos = Coords.create();
	}

	// instance methods

	image(universe: Universe): Image2
	{
		return this._image;
	}

	sizeInPixels(universe: Universe): Coords
	{
		return this.image(universe).sizeInPixels;
	}

	// visual

	draw
	(
		universe: Universe, world: World, place: Place, entity: Entity,
		display: Display
	): void
	{
		var image = this.image(universe);
		var imageSize = image.sizeInPixels;
		var drawPos = this._drawPos.clear().subtract(imageSize).half().add
		(
			entity.locatable().loc.pos
		);
		if (this.isScaled)
		{
			display.drawImageScaled(image, drawPos, imageSize);
		}
		else
		{
			display.drawImage(image, drawPos);
		}
	}

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

}
