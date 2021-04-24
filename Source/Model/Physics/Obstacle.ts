
namespace ThisCouldBeBetter.GameFramework
{

export class Obstacle implements EntityProperty
{
	collide(u: Universe, w: World, p: Place, e: Entity, eOther: Entity): void
	{
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

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
}

}
