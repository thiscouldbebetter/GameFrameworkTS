
namespace ThisCouldBeBetter.GameFramework
{

export class VisualImageMock implements VisualImage
{
	_sizeInPixels: Coords;

	constructor(sizeInPixels: Coords)
	{
		this._sizeInPixels = sizeInPixels;
	}

	// Transform.

	transform(transformToApply: TransformBase): VisualImageMock
	{
		return this;
	}

	// Visual.

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{}

	// Clonable.

	clone(): VisualImageMock { return this; }

	overwriteWith(x: VisualImageMock): VisualImageMock { return this; }

	// VisualImage.

	image(u: Universe): Image2
	{
		throw new Error("Not implemented!");
	}

	sizeInPixels(u: Universe): Coords
	{
		return this._sizeInPixels;
	}
}

}
