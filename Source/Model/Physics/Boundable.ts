
namespace ThisCouldBeBetter.GameFramework
{

export interface BoundableBase extends EntityPropertyBase
{
	bounds: ShapeBase;
}

export class Boundable<TBounds extends ShapeBase>
	implements BoundableBase, EntityProperty<Boundable<TBounds>>
{
	bounds: TBounds;

	constructor(bounds: TBounds)
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

	clone(): Boundable<TBounds>
	{
		return new Boundable(this.bounds.clone() as TBounds);
	}

	overwriteWith(other: Boundable<TBounds>): Boundable<TBounds>
	{
		this.bounds.overwriteWith(other.bounds);
		return this;
	}

	// Equatable

	equals(other: Boundable<TBounds>): boolean { return false; } // todo

}

}
