
namespace ThisCouldBeBetter.GameFramework
{

export class Movable implements EntityProperty<Movable>
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
		this.accelerationPerTick = accelerationPerTick || .1;
		this.speedMax = speedMax || 3;
		this._accelerate = accelerate || this.accelerateForward;
	}

	static default(): Movable
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
		return new Movable
		(
			this.accelerationPerTick,
			this.speedMax,
			this._accelerate
		);
	}

	overwriteWith(other: Movable): Movable
	{
		this.accelerationPerTick = other.accelerationPerTick;
		this.speedMax = other.speedMax;
		this._accelerate = other._accelerate;
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Movable): boolean { return false; } // todo

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

	// Activities.

	static activityDefnWanderBuild(): ActivityDefn
	{
		var returnValue = new ActivityDefn
		(
			"Wander",
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var entityActor = uwpe.entity;

				var actor = entityActor.actor();
				var activity = actor.activity;
				var targetEntity = activity.targetEntity();
				if (targetEntity == null)
				{
					var place = uwpe.place;
					var randomizer = uwpe.universe.randomizer;

					var targetPos = Coords.create().randomize
					(
						randomizer
					).multiply
					(
						place.size
					);

					targetEntity = Locatable.fromPos(targetPos).toEntity();
					activity.targetEntitySet(targetEntity);
				}

				var movable = entityActor.movable();
				var actorLocatable = entityActor.locatable();
				var targetLocatable = targetEntity.locatable();
				var distanceToTarget =
					actorLocatable.approachOtherWithAccelerationAndSpeedMax
					(
						targetLocatable,
						movable.accelerationPerTick,
						movable.speedMax
					);

				if (distanceToTarget < movable.speedMax)
				{
					activity.targetEntityClear();
				}
			}
		);

		return returnValue;
	}
}

}
