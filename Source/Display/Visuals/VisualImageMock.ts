
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

	transform(transformToApply: Transform): Transformable
	{
		return this;
	}

	// Visual.

	draw
	(
		universe: Universe, world: World, place: Place, entity: Entity,
		display: Display
	): void
	{}

	clone(): Visual { return this; }
	overwriteWith(x: Visual): Visual { return this; }

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
