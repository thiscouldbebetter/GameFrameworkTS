
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

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

}

}
