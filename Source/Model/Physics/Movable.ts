
namespace ThisCouldBeBetter.GameFramework
{

export class Movable extends EntityPropertyBase<Movable>
{
	_accelerationPerTickInDirection:
		(uwpe: UniverseWorldPlaceEntities, direction: Coords) => number;
	_speedMax:
		(uwpe: UniverseWorldPlaceEntities) => number;
	_canAccelerateInDirection:
		(uwpe: UniverseWorldPlaceEntities, direction: Coords) => boolean;

	constructor
	(
		accelerationPerTickInDirection:
			(uwpe: UniverseWorldPlaceEntities, direction: Coords) => number,
		speedMax:
			(uwpe: UniverseWorldPlaceEntities) => number,
		canAccelerateInDirection:
			(uwpe: UniverseWorldPlaceEntities, direction: Coords) => boolean,
	)
	{
		super();

		this._accelerationPerTickInDirection =
			accelerationPerTickInDirection == null
			? (uwpe2: UniverseWorldPlaceEntities, direction: Coords) => .1
			: accelerationPerTickInDirection;

		this._speedMax =
		(
			speedMax == null
			? (uwpe2: UniverseWorldPlaceEntities) => 3
			: speedMax
		);

		this._canAccelerateInDirection = canAccelerateInDirection;
	}

	static default(): Movable
	{
		return new Movable(null, null, null);
	}

	static entitiesFromPlace(place: Place): Entity[]
	{
		return place.entitiesByPropertyName(Movable.name);
	}

	static fromAccelerationPerTickAndSpeedMax
	(
		accelerationPerTick: number,
		speedMax: number
	): Movable
	{
		return new Movable
		(
			(uwpe: UniverseWorldPlaceEntities, direction: Coords) => accelerationPerTick,
			(uwpe: UniverseWorldPlaceEntities) => speedMax,
			null
		);
	}

	static fromAccelerationPerTickInDirectionAndSpeedMax
	(
		accelerationPerTickInDirection:
			(uwpe: UniverseWorldPlaceEntities, direction: Coords) => number,
		speedMax: number
	): Movable
	{
		return new Movable
		(
			accelerationPerTickInDirection,
			(uwpe: UniverseWorldPlaceEntities) => speedMax,
			null
		);
	}

	static fromAccelerationPerTickInDirectionSpeedMaxAndCanAccelerateInDirection
	(
		accelerationPerTickInDirection:
			(uwpe: UniverseWorldPlaceEntities, direction: Coords) => number,
		speedMax: number,
		canAccelerateInDirection:
			(uwpe: UniverseWorldPlaceEntities, direction: Coords) => boolean,
	): Movable
	{
		return new Movable
		(
			accelerationPerTickInDirection,
			(uwpe: UniverseWorldPlaceEntities) => speedMax,
			canAccelerateInDirection
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

	accelerationPerTickInDirection
	(
		uwpe: UniverseWorldPlaceEntities,
		direction: Coords
	): number
	{
		return this._accelerationPerTickInDirection(uwpe, direction);
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
		var canAccelerate =
			this.canAccelerateInDirection(uwpe, directionToAccelerateIn);
		if (canAccelerate)
		{
			var accel = this.accelerationPerTickInDirection
			(
				uwpe, directionToAccelerateIn
			);

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

	canAccelerateInDirection
	(
		uwpe: UniverseWorldPlaceEntities,
		direction: Coords
	): boolean
	{
		var returnValue =
		(
			this._canAccelerateInDirection == null
			? true
			: this._canAccelerateInDirection(uwpe, direction)
		);

		return returnValue;
	}

	moveInDirectionIfAble
	(
		uwpe: UniverseWorldPlaceEntities,
		directionToMoveIn: Coords,
		orientationMatchesMoveDirection: boolean
	): void
	{
		var entity = uwpe.entity;
		var entityLoc = Locatable.of(entity).loc;
		var canMove = this.canAccelerateInDirection(uwpe, directionToMoveIn); // hack
		if (canMove)
		{
			var speed = this.accelerationPerTickInDirection
			(
				uwpe, directionToMoveIn
			); // hack

			var displacement =
				directionToMoveIn
					.clone()
					.multiplyScalar(speed);

			entityLoc
				.pos
				.add(displacement);

			if (orientationMatchesMoveDirection)
			{
				entityLoc.orientation.forwardSet(directionToMoveIn);
			}
		}
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
			this._accelerationPerTickInDirection,
			this._speedMax,
			this._canAccelerateInDirection
		);
	}

	overwriteWith(other: Movable): Movable
	{
		this._accelerationPerTickInDirection = other._accelerationPerTickInDirection;
		this._speedMax = other._speedMax;
		this._canAccelerateInDirection = other._canAccelerateInDirection;
		return this;
	}

	// EntityProperty.

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

	static actionMove_Perform
	(
		uwpe: UniverseWorldPlaceEntities,
		direction: Coords,
		orientationMatchesMoveDirection: boolean
	): void
	{
		var actor = uwpe.entity;
		var movable = Movable.of(actor);
		movable.moveInDirectionIfAble
		(
			uwpe, direction, orientationMatchesMoveDirection
		);
	}

	static actionMoveWithoutFacingDown(): Action
	{
		return Action.fromNameAndPerform
		(
			"Move Down",
			uwpe =>
				this.actionMove_Perform
				(
					uwpe,
					Coords.Instances().ZeroOneZero,
					false // orientationMatchesMove
				)
		);
	}

	static actionMoveWithoutFacingUp(): Action
	{
		return Action.fromNameAndPerform
		(
			"Accelerate Up",
			uwpe =>
				this.actionMove_Perform
				(
					uwpe,
					Coords.Instances().ZeroMinusOneZero,
					false // orientationMatchesMove
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
		var actorPos = actorLocatable.pos();
		var targetPos = targetLocatable.pos();
		var displacementFromActorToTarget =
			targetPos
				.clone()
				.subtract(actorPos);
		var directionToTarget =
			displacementFromActorToTarget.normalize();
		var accelerationPerTick =
			movable.accelerationPerTickInDirection(uwpe, directionToTarget);
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
