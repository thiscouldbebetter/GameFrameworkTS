
namespace ThisCouldBeBetter.GameFramework
{

export class Obstacle extends EntityPropertyBase<Obstacle>
{
	constructor()
	{
		super();
	}

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
}

}
