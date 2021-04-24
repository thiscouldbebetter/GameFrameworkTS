
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

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
}

}
