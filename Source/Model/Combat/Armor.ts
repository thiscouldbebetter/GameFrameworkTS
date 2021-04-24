
namespace ThisCouldBeBetter.GameFramework
{

export class Armor implements EntityProperty
{
	damageMultiplier: number;

	constructor(damageMultiplier: number)
	{
		this.damageMultiplier = damageMultiplier;
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}

}
