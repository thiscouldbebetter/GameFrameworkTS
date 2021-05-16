
namespace ThisCouldBeBetter.GameFramework
{

export class Audible implements EntityProperty
{
	hasBeenHeard: boolean;

	constructor()
	{
		this.hasBeenHeard = false;
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
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
}

}
