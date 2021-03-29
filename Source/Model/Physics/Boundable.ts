
namespace ThisCouldBeBetter.GameFramework
{

export class Boundable extends EntityProperty
{
	bounds: any;

	constructor(bounds: any)
	{
		super();
		this.bounds = bounds;
	}

	// EntityProperty.

	initialize(u: Universe, w: World, p: Place, e: Entity)
	{
		this.updateForTimerTick(u, w, p, e);
	}

	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity)
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
