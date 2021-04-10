
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

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}

	initialize(u: Universe, w: World, p: Place, e: Entity): void
	{
		this.updateForTimerTick(u, w, p, e);
	}

	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void
	{
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
