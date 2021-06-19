
namespace ThisCouldBeBetter.GameFramework
{

export class Damager implements EntityProperty
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
}

}
