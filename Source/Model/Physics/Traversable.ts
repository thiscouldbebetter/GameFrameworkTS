
namespace ThisCouldBeBetter.GameFramework
{

export class Traversable implements EntityProperty
{
	isBlocking: boolean

	constructor(isBlocking: boolean)
	{
		this.isBlocking = isBlocking;
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
}

}
