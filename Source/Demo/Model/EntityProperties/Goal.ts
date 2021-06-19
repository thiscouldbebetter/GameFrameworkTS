
class Goal implements EntityProperty
{
	numberOfKeysToUnlock: number;

	constructor(numberOfKeysToUnlock: number)
	{
		this.numberOfKeysToUnlock = numberOfKeysToUnlock;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

}
