
namespace ThisCouldBeBetter.GameFramework
{

export class Movable implements EntityProperty<Movable>
{
	_accelerationPerTick: (uwpe: UniverseWorldPlaceEntities) => number;
	_speedMax: (uwpe: UniverseWorldPlaceEntities) => number;
	_canAccelerate: (uwpe: UniverseWorldPlaceEntities) => boolean;

	constructor
	(
		accelerationPerTick: (uwpe: UniverseWorldPlaceEntities) => number,
		speedMax: (uwpe: UniverseWorldPlaceEntities) => number,
		canAccelerate: (uwpe: UniverseWorldPlaceEntities) => boolean,
	)
	{
		this._accelerationPerTick =
			accelerationPerTick == null
			? (uwpe2: UniverseWorldPlaceEntities) => .1
			: accelerationPerTick;

		this._speedMax =
		(
			speedMax == null
			? (uwpe2: UniverseWorldPlaceEntities) => 3
			: speedMax
		);
		this._canAccelerate = canAccelerate;
	}

	static default(): Movable
	{
		return new Movable(null, null, null);
	}

	static entitiesFromPlace(place: Place): Entity[]
	{
		return place.entitiesByPropertyName(Movable.name);
	}

	static fromAccelerationAndSpeedMax
	(
		accelerationPerTick: number,
		speedMax: number
	): Movable
	{
		return new Movable
		(
			(uwpe: UniverseWorldPlaceEntities) => accelerationPerTick,
			(uwpe: UniverseWorldPlaceEntities) => speedMax,
			null
		);
	}

	static fromSpeedMax
	(
		speedMax: number
	): Movable
	{
		var speedMaxGet = (uwpe: UniverseWorldPlaceEntities) => speedMax;
		return new Movable(speedMaxGet, speedMaxGet, null);
	}

	static of(entity: Entity): Movable
	{
		return entity.propertyByName(Movable.name) as Movable;
	}

	accelerationPerTick(uwpe: UniverseWorldPlaceEntities): number
	{
		return this._accelerationPerTick(uwpe);
	}

	accelerateForward(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityMovable = uwpe.entity;
		var entityLoc = Locatable.of(entityMovable).loc;
		var forward = entityLoc.orientation.forward;
		var accel = this.accelerationPerTick(uwpe);

		entityLoc.accel.overwriteWith
		(
			forward
		).multiplyScalar
		(
			accel
		);
	}

	accelerateForwardIfAble(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.canAccelerate(uwpe))
		{
			this.accelerateForward(uwpe);
		}
	}

	accelerateInDirectionIfAble
	(
		uwpe: UniverseWorldPlaceEntities,
		directionToMove: Coords
	): void
	{
		var entity = uwpe.entity;
		var entityLoc = Locatable.of(entity).loc;
		var canAccelerate = this.canAccelerate(uwpe);
		if (canAccelerate)
		{
			entityLoc.orientation.forwardSet(directionToMove);
			Movable.of(entity).accelerateForward(uwpe);
		}
	}

	canAccelerate(uwpe: UniverseWorldPlaceEntities): boolean
	{
		var returnValue =
		(
			this._canAccelerate == null
			? true
			: this._canAccelerate(uwpe)
		);

		return returnValue;
	}

	speedMax(uwpe: UniverseWorldPlaceEntities): number
	{
		return this._speedMax(uwpe);
	}

	toConstraint(): Constraint_SpeedMaxXY
	{
		return new Constraint_SpeedMaxXY(this.speedMax(null));
	}

	// Clonable.

	clone(): Movable
	{
		return new Movable
		(
			this._accelerationPerTick,
			this._speedMax,
			this._canAccelerate
		);
	}

	overwriteWith(other: Movable): Movable
	{
		this.accelerationPerTick = other.accelerationPerTick;
		this.speedMax = other.speedMax;
		this._canAccelerate = other._canAccelerate;
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return Movable.name; }
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
				var movable = Movable.of(actor);
				var direction = Coords.Instances().ZeroOneZero;
				movable.accelerateInDirectionIfAble(uwpe, direction);
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
				var movable = Movable.of(actor);
				var direction = Coords.Instances().MinusOneZeroZero;
				movable.accelerateInDirectionIfAble(uwpe, direction);
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
				var movable = Movable.of(actor);
				var direction = Coords.Instances().OneZeroZero;
				movable.accelerateInDirectionIfAble(uwpe, direction);
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
				var movable = Movable.of(actor);
				var direction = Coords.Instances().ZeroMinusOneZero;
				movable.accelerateInDirectionIfAble(uwpe, direction);
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

				var actor = Actor.of(entityActor);
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
						place.size()
					);

					targetEntity = Locatable.fromPos(targetPos).toEntity();
					activity.targetEntitySet(targetEntity);
				}

				var movable = Movable.of(entityActor);
				var actorLocatable = Locatable.of(entityActor);
				var targetLocatable = Locatable.of(targetEntity);
				var accelerationPerTick = movable.accelerationPerTick(uwpe);
				var speedMax = movable.speedMax(uwpe);
				var distanceToTarget =
					actorLocatable.approachOtherWithAccelerationAndSpeedMaxAndReturnDistance
					(
						targetLocatable,
						accelerationPerTick,
						speedMax
					);

				if (distanceToTarget < speedMax)
				{
					activity.targetEntityClear();
				}
			}
		);

		return returnValue;
	}
}

}
