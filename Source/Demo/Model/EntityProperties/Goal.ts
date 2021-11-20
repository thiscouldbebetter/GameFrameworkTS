
class Goal implements EntityProperty<Goal>
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

	// Equatable

	equals(other: Goal): boolean { return false; } // todo
}
