
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

	static of(entity: Entity): Perceptor
	{
		return entity.propertyByName(Perceptor.name) as Perceptor;
	}

	// Clonable.
	clone(): Perceptor { return this; }
	overwriteWith(other: Perceptor): Perceptor { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return Perceptor.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Perceptor): boolean { return false; } // todo

}

}
