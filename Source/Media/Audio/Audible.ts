
namespace ThisCouldBeBetter.GameFramework
{

export class Audible implements EntityProperty<Audible>
{
	hasBeenHeard: boolean;

	constructor()
	{
		this.hasBeenHeard = false;
	}

	static of(entity: Entity): Audible
	{
		return entity.propertyByName(Audible.name) as Audible;
	}

	// Cloneable

	clone(): Audible
	{
		return new Audible();
	}

	overwriteWith(other: Audible): Audible
	{
		this.hasBeenHeard = other.hasBeenHeard;
		return this;
	}

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return Audible.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Audible): boolean { return false; } // todo

}

}
