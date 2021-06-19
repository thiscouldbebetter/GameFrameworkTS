
namespace ThisCouldBeBetter.GameFramework
{

export class Movable implements EntityProperty
{
	accelerationPerTick: number;
	speedMax: number;
	_accelerate: (uwpe: UniverseWorldPlaceEntities, a: number) => void;

	constructor
	(
		accelerationPerTick: number,
		speedMax: number,
		accelerate: (uwpe: UniverseWorldPlaceEntities, a: number) => void
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
		uwpe: UniverseWorldPlaceEntities
	): void
	{
		this._accelerate(uwpe, this.accelerationPerTick);
	}

	accelerateForward(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityMovable = uwpe.entity;
		var entityLoc = entityMovable.locatable().loc;
		entityLoc.accel.overwriteWith
		(
			entityLoc.orientation.forward
		).multiplyScalar
		(
			this.accelerationPerTick
		);
	}

	accelerateInDirection
	(
		uwpe: UniverseWorldPlaceEntities, directionToMove: Coords
	): void
	{
		var entity = uwpe.entity;
		var entityLoc = entity.locatable().loc;
		var isEntityStandingOnGround =
			(entityLoc.pos.z >= 0 && entityLoc.vel.z >= 0);
		if (isEntityStandingOnGround)
		{
			entityLoc.orientation.forwardSet(directionToMove);
			entity.movable().accelerate(uwpe);
		}
	}

	// Clonable.

	clone(): Movable
	{
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Actions.

	static actionAccelerateDown(): Action
	{
		return new Action
		(
			"AccelerateDown",
			// perform
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var actor = uwpe.entity;
				actor.movable().accelerateInDirection
				(
					uwpe, Coords.Instances().ZeroOneZero
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
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var actor = uwpe.entity;
				actor.movable().accelerateInDirection
				(
					uwpe, Coords.Instances().MinusOneZeroZero
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
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var actor = uwpe.entity;
				actor.movable().accelerateInDirection
				(
					uwpe, Coords.Instances().OneZeroZero
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
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var actor = uwpe.entity;
				actor.movable().accelerateInDirection
				(
					uwpe, Coords.Instances().ZeroMinusOneZero
				);
			}
		);
	}

}

}
