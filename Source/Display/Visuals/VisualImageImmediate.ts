
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

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var universe = uwpe.universe;
		var entity = uwpe.entity;

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

	clone(): VisualImageImmediate
	{
		return this; // todo
	}

	overwriteWith(other: VisualImageImmediate): VisualImageImmediate
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualImageImmediate
	{
		return this; // todo
	}
}

}
