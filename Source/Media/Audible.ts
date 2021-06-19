
namespace ThisCouldBeBetter.GameFramework
{

export class Audible implements EntityProperty
{
	hasBeenHeard: boolean;

	constructor()
	{
		this.hasBeenHeard = false;
	}

	// Cloneable

	clone(): Audible
	{
		return new Audible();
	}

	overwriteWith(other: Audible): Audible
	{
		this.hasBeenHeard = other.hasBeenHeard;
		return this;
	}

	// EntityProperty.
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
}

}
