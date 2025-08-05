
namespace ThisCouldBeBetter.GameFramework
{

export interface BoundableBase extends EntityProperty
{
	bounds: Shape;
}

export class Boundable<TBounds extends Shape> extends EntityPropertyBase<Boundable<TBounds>>
	implements BoundableBase
{
	bounds: TBounds;

	_boundsAtRest: Shape;
	_transformLocate: Transform_Locate;

	constructor(bounds: TBounds)
	{
		super();

		this.bounds = bounds.clone() as TBounds;

		this._boundsAtRest = this.bounds.clone();
		this._transformLocate = Transform_Locate.create();
	}

	static fromBounds<TBounds extends Shape>(bounds: TBounds): Boundable<TBounds>
	{
		return new Boundable(bounds);
	}

	static fromCollidable(collidable: Collidable): Boundable<BoxAxisAligned>
	{
		var collider = collidable.collider;
		var colliderAsBox =
			collider.toBoxAxisAligned(BoxAxisAligned.create() );
		var boundable = new Boundable(colliderAsBox);
		return boundable;
	}

	static of(entity: Entity): BoundableBase
	{
		return entity.propertyByName(Boundable.name) as BoundableBase;
	}

	// EntityProperty.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.updateForTimerTick(uwpe);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var e = uwpe.entity;
		this.bounds.overwriteWith(this._boundsAtRest);
		var dispositionToApply = Locatable.of(e).loc;
		this._transformLocate.loc.overwriteWith(dispositionToApply);
		this.bounds.transform(this._transformLocate);
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


}

}
