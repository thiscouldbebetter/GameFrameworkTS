
namespace ThisCouldBeBetter.GameFramework
{

export class Boundable implements EntityProperty
{
	bounds: any;

	constructor(bounds: any)
	{
		this.bounds = bounds;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.updateForTimerTick(uwpe);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var e = uwpe.entity;
		this.bounds.locate(e.locatable().loc);
	}

	// Clonable.

	clone(): Boundable
	{
		return new Boundable(this.bounds.clone());
	}

	overwriteWith(other: Boundable): Boundable
	{
		this.bounds.overwriteWith(other.bounds);
		return this;
	}
}

}
