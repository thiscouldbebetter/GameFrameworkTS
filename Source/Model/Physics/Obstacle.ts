
namespace ThisCouldBeBetter.GameFramework
{

export class Obstacle implements EntityProperty
{
	collide(uwpe: UniverseWorldPlaceEntities): void
	{
		var u = uwpe.universe;
		var e = uwpe.entity;
		var eOther = uwpe.entity2;
		var collisionHelper = u.collisionHelper;
		collisionHelper.collideEntitiesBounce(e, eOther);
		collisionHelper.collideEntitiesSeparate(eOther, e);
	}

	// Clonable.

	clone(): Obstacle
	{
		return this;
	}

	overwriteWith(other: Obstacle): Obstacle
	{
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
}

}
