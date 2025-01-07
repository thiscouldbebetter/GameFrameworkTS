
namespace ThisCouldBeBetter.GameFramework
{

export class VisualImageFromLibrary implements VisualImage
{
	imageName: string;

	_drawPos: Coords;

	constructor(imageName: string)
	{
		this.imageName = imageName;

		// Helper variables.
		this._drawPos = Coords.create();
	}

	// static methods

	static manyFromImages
	(
		images: Image2[], imageSizeScaled: Coords
	): VisualImageFromLibrary[]
	{
		var returnValues = [];

		for (var i = 0; i < images.length; i++)
		{
			var image = images[i];
			var visual = new VisualImageFromLibrary(image.name);
			returnValues.push(visual);
		}

		return returnValues;
	}

	// instance methods

	image(universe: Universe): Image2
	{
		return universe.mediaLibrary.imageGetByName(this.imageName);
	}

	sizeInPixels(universe: Universe): Coords
	{
		return this.image(universe).sizeInPixels;
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		var image = this.image(uwpe.universe);
		image.load(uwpe, null);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var universe = uwpe.universe;
		var entity = uwpe.entity;
		var image = this.image(universe);
		var imageSize = image.sizeInPixels;
		var drawPos = this._drawPos.clear().subtract(imageSize).half().add
		(
			Locatable.of(entity).loc.pos
		);
		display.drawImageScaled(image, drawPos, imageSize);
	}

	// Clonable.

	clone(): VisualImageFromLibrary
	{
		return this; // todo
	}

	overwriteWith(other: VisualImageFromLibrary): VisualImageFromLibrary
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualImageFromLibrary
	{
		return this; // todo
	}
}

}
