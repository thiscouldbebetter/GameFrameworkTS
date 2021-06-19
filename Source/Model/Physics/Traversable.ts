
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

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
}

}
