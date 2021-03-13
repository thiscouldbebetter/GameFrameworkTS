
namespace ThisCouldBeBetter.GameFramework
{

export class Obstacle extends EntityProperty
{
	constructor()
	{
		super();
	}

	collide(u: Universe, w: World, p: Place, e: Entity, eOther: Entity)
	{
		var collisionHelper = u.collisionHelper;
		collisionHelper.collideEntitiesBounce(e, eOther);
		collisionHelper.collideEntitiesSeparate(eOther, e);
	}

	// Clonable.

	clone()
	{
		return this;
	}

	overwriteWith(other: Obstacle)
	{
		return this;
	}
}

}
