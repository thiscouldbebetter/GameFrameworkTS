
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

	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity)
	{
		this.bounds.center.overwriteWith(e.locatable().loc.pos);
	}

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
