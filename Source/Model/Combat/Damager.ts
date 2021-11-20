
namespace ThisCouldBeBetter.GameFramework
{

export class Damager implements EntityProperty<Damager>
{
	damagePerHit: Damage;

	constructor(damagePerHit: Damage)
	{
		this.damagePerHit = damagePerHit;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Damager): boolean { return false; } // todo
}

}
