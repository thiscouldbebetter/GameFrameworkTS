
namespace ThisCouldBeBetter.GameFramework
{

export class Armor implements EntityProperty<Armor>
{
	damageMultiplier: number;

	constructor(damageMultiplier: number)
	{
		this.damageMultiplier = damageMultiplier;
	}

	// Clonable.
	clone(): Armor { return this; }
	overwriteWith(other: Armor): Armor { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Armor): boolean { return false; } // todo
}

}
