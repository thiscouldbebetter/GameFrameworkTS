
namespace ThisCouldBeBetter.GameFramework
{

export class Movable extends EntityProperty
{
	accelerationPerTick: number;
	speedMax: number;
	_accelerate: (u: Universe, w: World, p: Place, e: Entity, a: number) => void;

	constructor
	(
		accelerationPerTick: number,
		speedMax: number,
		accelerate: (u: Universe, w: World, p: Place, e: Entity, a: number) => void
	)
	{
		super();
		this.accelerationPerTick = accelerationPerTick;
		this.speedMax = speedMax;
		this._accelerate = accelerate || this.accelerateForward;
	}

	static create(): Movable
	{
		return new Movable(null, null, null);
	}

	accelerate(universe: Universe, world: World, place: Place, entityMovable: Entity)
	{
		this._accelerate(universe, world, place, entityMovable, this.accelerationPerTick);
	}

	accelerateForward(universe: Universe, world: World, place: Place, entityMovable: Entity, accelerationPerTick: number)
	{
		var entityLoc = entityMovable.locatable().loc;
		entityLoc.accel.overwriteWith
		(
			entityLoc.orientation.forward
		).multiplyScalar
		(
			entityMovable.movable().accelerationPerTick
		);
	}

	accelerateInDirection
	(
		universe: Universe, world: World, place: Place, entity: Entity, directionToMove: Coords
	)
	{
		var entityLoc = entity.locatable().loc;
		var isEntityStandingOnGround =
			(entityLoc.pos.z >= 0 && entityLoc.vel.z >= 0);
		if (isEntityStandingOnGround)
		{
			entityLoc.orientation.forwardSet(directionToMove);
			entity.movable().accelerate(universe, world, place, entity);
		}
	}

	// cloneable

	clone(): Movable
	{
		return this;
	}
}

}
