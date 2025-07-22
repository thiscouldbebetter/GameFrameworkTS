
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

	accelerateAndFaceForwardIfAble(uwpe: UniverseWorldPlaceEntities): void
	{
		var forward = Locatable.of(uwpe.entity).loc.orientation.forward;
		this.accelerateInDirectionIfAble(uwpe, forward, true);
	}

	accelerateInDirectionIfAble
	(
		uwpe: UniverseWorldPlaceEntities,
		directionToAccelerateIn: Coords,
		orientationMatchesAcceleration: boolean
	): void
	{
		var entity = uwpe.entity;
		var entityLoc = Locatable.of(entity).loc;
		var canAccelerate = this.canAccelerate(uwpe);
		if (canAccelerate)
		{
			var accel = this.accelerationPerTick(uwpe);

			entityLoc
				.accel
				.overwriteWith(directionToAccelerateIn)
				.multiplyScalar(accel);

			if (orientationMatchesAcceleration)
			{
				entityLoc.orientation.forwardSet(directionToAccelerateIn);
			}
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

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;
		var constrainable = Constrainable.of(entity);
		if (constrainable != null)
		{
			var constraintMovable =
				constrainable.constraintByClassName(Constraint_Movable.name);

			if (constraintMovable == null)
			{
				constraintMovable = Constraint_Movable.create();
				constrainable.constraintAdd(constraintMovable);
			}
		}
	}

	propertyName(): string { return Movable.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Movable): boolean { return false; } // todo

	// Actions.

	static actionAccelerate_Perform
	(
		uwpe: UniverseWorldPlaceEntities,
		direction: Coords,
		orientationMatchesAcceleration: boolean
	): void
	{
		var actor = uwpe.entity;
		var movable = Movable.of(actor);
		movable.accelerateInDirectionIfAble
		(
			uwpe, direction, orientationMatchesAcceleration
		);
	}

	static actionAccelerateAndFaceDown(): Action
	{
		return Action.fromNameAndPerform
		(
			"Accelerate and Face Down",
			uwpe =>
				this.actionAccelerate_Perform
				(
					uwpe,
					Coords.Instances().ZeroOneZero,
					true // orientationMatchesAcceleration
				)
		);
	}

	static actionAccelerateAndFaceLeft(): Action
	{
		return Action.fromNameAndPerform
		(
			"Accelerate and Face Left",
			uwpe =>
				this.actionAccelerate_Perform
				(
					uwpe,
					Coords.Instances().MinusOneZeroZero,
					true // orientationMatchesAcceleration
				)
		);
	}

	static actionAccelerateAndFaceRight(): Action
	{
		return Action.fromNameAndPerform
		(
			"Accelerate and Face Right",
			uwpe =>
				this.actionAccelerate_Perform
				(
					uwpe,
					Coords.Instances().OneZeroZero,
					true // orientationMatchesAcceleration
				)
		);
	}

	static actionAccelerateAndFaceUp(): Action
	{
		return Action.fromNameAndPerform
		(
			"Accelerate and Face Up",
			uwpe =>
				this.actionAccelerate_Perform
				(
					uwpe,
					Coords.Instances().ZeroMinusOneZero,
					true // orientationMatchesAcceleration
				)
		);
	}

	static actionAccelerateWithoutFacingDown(): Action
	{
		return Action.fromNameAndPerform
		(
			"Accelerate Down",
			uwpe =>
				this.actionAccelerate_Perform
				(
					uwpe,
					Coords.Instances().ZeroOneZero,
					false // orientationMatchesAcceleration
				)
		);
	}

	static actionAccelerateWithoutFacingLeft(): Action
	{
		return Action.fromNameAndPerform
		(
			"Accelerate Left",
			uwpe =>
				this.actionAccelerate_Perform
				(
					uwpe,
					Coords.Instances().MinusOneZeroZero,
					false // orientationMatchesAcceleration
				)
		);
	}

	static actionAccelerateWithoutFacingRight(): Action
	{
		return Action.fromNameAndPerform
		(
			"Accelerate Right",
			uwpe =>
				this.actionAccelerate_Perform
				(
					uwpe,
					Coords.Instances().OneZeroZero,
					false // orientationMatchesAcceleration
				)
		);
	}

	static actionAccelerateWithoutFacingUp(): Action
	{
		return Action.fromNameAndPerform
		(
			"Accelerate Up",
			uwpe =>
				this.actionAccelerate_Perform
				(
					uwpe,
					Coords.Instances().ZeroMinusOneZero,
					false // orientationMatchesAcceleration
				)
		);
	}

	// Activities.

	static activityDefnWanderBuild(): ActivityDefn
	{
		var returnValue = ActivityDefn.fromNameAndPerform
		(
			"Wander",
			uwpe => this.activityDefnWander_Perform(uwpe)
		);

		return returnValue;
	}

	static activityDefnWander_Perform(uwpe: UniverseWorldPlaceEntities): void
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

}

}
