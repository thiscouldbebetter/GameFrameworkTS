
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

	_boundsAtRest: ShapeBase;
	_transformLocate: Transform_Locate;

	constructor(bounds: TBounds)
	{
		this.bounds = bounds.clone() as TBounds;

		this._boundsAtRest = this.bounds.clone();
		this._transformLocate = Transform_Locate.create();
	}

	static fromBounds<TBounds extends ShapeBase>(bounds: TBounds): Boundable<TBounds>
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

	finalize(uwpe: UniverseWorldPlaceEntities): void {}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.updateForTimerTick(uwpe);
	}

	propertyName(): string { return Boundable.name; }

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

	// Equatable

	equals(other: Boundable<TBounds>): boolean { return false; } // todo

}

}
