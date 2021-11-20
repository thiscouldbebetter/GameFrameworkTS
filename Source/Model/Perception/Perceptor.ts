
namespace ThisCouldBeBetter.GameFramework
{

export class Perceptor implements EntityProperty<Perceptor>
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

	// Equatable

	equals(other: Perceptor): boolean { return false; } // todo

}

}
