
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
	clone(): Armor { throw new Error("Not yet implemented."); }
	overwriteWith(other: Armor): Armor { throw new Error("Not yet implemented."); }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Armor): boolean { return false; } // todo
}

}
