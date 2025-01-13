
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

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return true;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		// Do nothing.
	}

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
