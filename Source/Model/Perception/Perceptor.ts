
namespace ThisCouldBeBetter.GameFramework
{

export class Perceptor implements EntityProperty
{
	sightThreshold: number;
	hearingThreshold: number;

	constructor(sightThreshold: number, hearingThreshold: number)
	{
		this.sightThreshold = sightThreshold;
		this.hearingThreshold = hearingThreshold;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
}

}
