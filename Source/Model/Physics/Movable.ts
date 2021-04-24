
namespace ThisCouldBeBetter.GameFramework
{

export class Movable implements EntityProperty
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
		this.accelerationPerTick = accelerationPerTick;
		this.speedMax = speedMax;
		this._accelerate = accelerate || this.accelerateForward;
	}

	static create(): Movable
	{
		return new Movable(null, null, null);
	}

	static fromAccelerationAndSpeedMax
	(
		accelerationPerTick: number, speedMax: number
	): Movable
	{
		return new Movable(accelerationPerTick, speedMax, null)
	}

	accelerate
	(
		universe: Universe, world: World, place: Place, entityMovable: Entity
	): void
	{
		this._accelerate(universe, world, place, entityMovable, this.accelerationPerTick);
	}

	accelerateForward
	(
		universe: Universe, world: World, place: Place, entityMovable: Entity,
		accelerationPerTick: number
	): void
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
		universe: Universe, world: World, place: Place, entity: Entity,
		directionToMove: Coords
	): void
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

	// Clonable.

	clone(): Movable
	{
		return this;
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

	// Actions.

	static actionAccelerateDown(): Action
	{
		return new Action
		(
			"AccelerateDown",
			// perform
			(universe: Universe, world: World, place: Place, actor: Entity) =>
			{
				actor.movable().accelerateInDirection
				(
					universe, world, place, actor, Coords.Instances().ZeroOneZero
				);
			}
		)
	}

	static actionAccelerateLeft(): Action
	{
		return new Action
		(
			"AccelerateLeft",
			// perform
			(universe: Universe, world: World, place: Place, actor: Entity) =>
			{
				actor.movable().accelerateInDirection
				(
					universe, world, place, actor, Coords.Instances().MinusOneZeroZero
				);
			}
		);
	}

	static actionAccelerateRight(): Action
	{
		return new Action
		(
			"AccelerateRight",
			// perform
			(universe: Universe, world: World, place: Place, actor: Entity) =>
			{
				actor.movable().accelerateInDirection
				(
					universe, world, place, actor, Coords.Instances().OneZeroZero
				);
			}
		);
	}

	static actionAccelerateUp(): Action
	{
		return new Action
		(
			"AccelerateUp",
			// perform
			(universe: Universe, world: World, place: Place, actor: Entity) =>
			{
				actor.movable().accelerateInDirection
				(
					universe, world, place, actor, Coords.Instances().ZeroMinusOneZero
				);
			}
		);
	}

}

}
