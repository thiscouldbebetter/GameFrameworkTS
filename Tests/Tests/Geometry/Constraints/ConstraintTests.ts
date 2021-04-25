
class ConstraintTests extends TestFixture
{
	_universe: Universe;
	_world: World;
	_place: Place;

	_entityToConstrain: Entity;
	_constrainable: Constrainable;
	_locatable: Locatable;
	_entityToConstrainLoc: Disposition;

	constructor()
	{
		super(ConstraintTests.name);
		var environment = new MockEnvironment();
		this._universe = environment.universe;
		this._world = this._universe.world;
		this._place = this._world.placeCurrent;

		this._constrainable = Constrainable.create();
		this._entityToConstrainLoc = Disposition.create();
		this._locatable = new Locatable(this._entityToConstrainLoc);
		this._entityToConstrain = new Entity
		(
			"EntityToConstrain",
			[
				this._constrainable,
				this._locatable
			]
		);
	}

	tests(): ( ()=>void )[]
	{
		var tests =
		[
			this.attachToEntityWithId,
			this.attachToEntityWithName,
			this.conditional,
			this.containInBox,
			this.containInHemispace,
			this.frictionDry,
			this.frictionXY,
			this.gravity,
			this.offset,
			this.orientToward,
			this.speedMaxXY,
			this.stopBelowSpeedMin,
			this.trimToPlaceSize,
			this.wrapToPlaceSize,
			this.wrapToPlaceSizeX,
			this.wrapToPlaceSizeXTrimY
		];

		return tests;
	}

	// Tests.

	attachToEntityWithId(): void
	{
		var posBeforeConstraint = this._entityToConstrainLoc.pos.clone();

		var entityToAttachToPos =
			Coords.create().randomize(this._universe.randomizer);
		var entityToAttachTo = new Entity
		(
			"EntityToAttachTo",
			[ Locatable.fromPos(entityToAttachToPos) ]
		);
		this._place.entitySpawn(this._universe, this._world, entityToAttachTo);

		var constraint =
			new Constraint_AttachToEntityWithId(entityToAttachTo.id);
		this._constrainable.clear().constraintAdd(constraint);

		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);
		this._place.entityRemove(entityToAttachTo);

		var posAfterConstraint = this._entityToConstrainLoc.pos.clone();

		Assert.areNotEqual(posBeforeConstraint, posAfterConstraint);

		var posAfterConstraintExpected = entityToAttachToPos;
		Assert.areEqual(posAfterConstraintExpected, posAfterConstraint);
	}

	attachToEntityWithName(): void
	{
		var posBeforeConstraint = this._entityToConstrainLoc.pos.clone();

		var entityToAttachToPos =
			Coords.create().randomize(this._universe.randomizer);
		var entityToAttachTo = new Entity
		(
			"EntityToAttachTo",
			[ Locatable.fromPos(entityToAttachToPos) ]
		);
		this._place.entitySpawn(this._universe, this._world, entityToAttachTo);

		var constraint =
			new Constraint_AttachToEntityWithName(entityToAttachTo.name);
		this._constrainable.clear().constraintAdd(constraint);

		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);
		this._place.entityRemove(entityToAttachTo);

		var posAfterConstraint = this._entityToConstrainLoc.pos.clone();

		Assert.areNotEqual(posBeforeConstraint, posAfterConstraint);

		var posAfterConstraintExpected = entityToAttachToPos;
		Assert.areEqual(posAfterConstraintExpected, posAfterConstraint);
	}

	conditional(): void
	{
		// todo
	}

	containInBox(): void
	{
		var posBeforeConstraint = this._entityToConstrainLoc.pos.clone();

		var boxToConstrainTo = Box.fromMinAndSize
		(
			new Coords(10, 20, 30), // min
			new Coords(40, 50, 60) // size
		);
		Assert.isFalse(boxToConstrainTo.containsPoint(posBeforeConstraint));

		var constraint =
			new Constraint_ContainInBox(boxToConstrainTo);
		this._constrainable.clear().constraintAdd(constraint);

		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);

		var posAfterConstraint = this._entityToConstrainLoc.pos.clone();

		Assert.areNotEqual(posBeforeConstraint, posAfterConstraint);

		Assert.isTrue(boxToConstrainTo.containsPoint(posAfterConstraint));
	}

	containInHemispace(): void
	{
		var posBeforeConstraint = this._entityToConstrainLoc.pos.clone();

		var hemispaceToConstrainTo = new Hemispace
		(
			new Plane(new Coords(0, 0, 1), -100)
		);
		Assert.isFalse(hemispaceToConstrainTo.containsPoint(posBeforeConstraint));

		var constraint =
			new Constraint_ContainInHemispace(hemispaceToConstrainTo);
		this._constrainable.clear().constraintAdd(constraint);

		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);

		var posAfterConstraint = this._entityToConstrainLoc.pos.clone();

		Assert.areNotEqual(posBeforeConstraint, posAfterConstraint);

		Assert.isTrue(hemispaceToConstrainTo.containsPoint(posAfterConstraint));
	}

	frictionDry(): void
	{
		var entityVel = this._entityToConstrainLoc.vel;
		entityVel.overwriteWithDimensions(1, 1, 1);

		var constraint = new Constraint_FrictionDry(.1);
		this._constrainable.clear().constraintAdd(constraint);

		var numberOfTicks = 10;
		for (var i = 0; i < numberOfTicks; i++)
		{
			var speedBeforeConstraint = entityVel.magnitude();

			constraint.constrain
			(
				this._universe, this._world, this._place, this._entityToConstrain
			);

			var speedAfterConstraint = entityVel.magnitude();
			var isEntitySlowerAfterConstraint =
			(
				speedAfterConstraint < speedBeforeConstraint
			);

			Assert.isTrue(isEntitySlowerAfterConstraint);
		}
	}

	frictionXY(): void
	{
		var entityVel = this._entityToConstrainLoc.vel;
		entityVel.overwriteWithDimensions(1, 1, 1);

		var constraint = new Constraint_FrictionXY(.1, 0);
		this._constrainable.clear().constraintAdd(constraint);

		var numberOfTicks = 10;
		for (var i = 0; i < numberOfTicks; i++)
		{
			var speedXYBeforeConstraint = entityVel.magnitudeXY();
			var speedZBeforeConstraint = entityVel.z;

			constraint.constrain
			(
				this._universe, this._world, this._place, this._entityToConstrain
			);

			var speedXYAfterConstraint = entityVel.magnitudeXY();
			var speedZAfterConstraint = entityVel.z;

			var isSpeedXYSlowerAfterConstraint =
			(
				speedXYAfterConstraint < speedXYBeforeConstraint
			);
			Assert.isTrue(isSpeedXYSlowerAfterConstraint);

			var isSpeedZEqualAfterConstraint =
			(
				speedZAfterConstraint == speedZBeforeConstraint
			);
			Assert.isTrue(isSpeedZEqualAfterConstraint);
		}
	}

	gravity()
	{
		var entityAccel = this._entityToConstrainLoc.accel;
		entityAccel.overwriteWithDimensions(1, 1, 1);

		var constraint = new Constraint_Gravity(new Coords(0, 0, .1));
		this._constrainable.clear().constraintAdd(constraint);

		var accelXYBeforeConstraint = entityAccel.magnitudeXY();
		var accelZBeforeConstraint = entityAccel.z;

		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);

		var accelXYAfterConstraint = entityAccel.magnitudeXY();
		var accelZAfterConstraint = entityAccel.z;

		var isAccelXYSameAfterConstraint =
		(
			accelXYAfterConstraint == accelXYBeforeConstraint
		);
		Assert.isTrue(isAccelXYSameAfterConstraint);

		var isAccelZGreaterAfterConstraint =
		(
			accelZAfterConstraint > accelZBeforeConstraint
		);
		Assert.isTrue(isAccelZGreaterAfterConstraint);
	}

	offset(): void
	{
		var posBeforeConstraint = this._entityToConstrainLoc.pos.clone();

		var offsetToApply = new Coords(1, 2, 3);
		var constraint = new Constraint_Offset(offsetToApply);
		this._constrainable.clear().constraintAdd(constraint);

		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);

		var posAfterConstraint = this._entityToConstrainLoc.pos.clone();

		Assert.areNotEqual(posBeforeConstraint, posAfterConstraint);

		var posAfterConstraintExpected =
			posBeforeConstraint.clone().add(offsetToApply);
		Assert.areEqual(posAfterConstraintExpected, posAfterConstraint);
	}

	orientToward(): void
	{
		var entityOrientation = this._entityToConstrainLoc.orientation;
		var forwardBeforeConstraint = entityOrientation.forward.clone();

		var entityToOrientTowardPos =
			Coords.create().randomize(this._universe.randomizer).multiplyScalar(1000);
		var entityToOrientToward = new Entity
		(
			"EntityToAttachTo",
			[ Locatable.fromPos(entityToOrientTowardPos) ]
		);
		this._place.entitySpawn(this._universe, this._world, entityToOrientToward);

		var constraint =
			new Constraint_OrientToward(entityToOrientToward.name);
		this._constrainable.clear().constraintAdd(constraint);

		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);
		this._place.entityRemove(entityToOrientToward);

		var forwardAfterConstraint = entityOrientation.forward;

		Assert.areNotEqual(forwardBeforeConstraint, forwardAfterConstraint);

		var forwardAfterConstraintExpected =
			entityToOrientTowardPos.clone().subtract
			(
				this._entityToConstrainLoc.pos
			).normalize();
		Assert.isTrue
		(
			forwardAfterConstraintExpected.equalsWithinError
			(
				forwardAfterConstraint, 0.001
			)
		);
	}

	speedMaxXY(): void
	{
		var entityVel = this._entityToConstrainLoc.vel;
		entityVel.overwriteWithDimensions(1, 1, 1).multiplyScalar(100);

		var speedMax = 1;
		var constraint = new Constraint_SpeedMaxXY(speedMax);
		this._constrainable.clear().constraintAdd(constraint);

		var speedZBeforeConstraint = entityVel.z;

		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);

		var speedXYAfterConstraint = entityVel.magnitudeXY();
		var speedZAfterConstraint = entityVel.z;

		var isSpeedXYMaxAfterConstraint =
		(
			Math.abs(speedXYAfterConstraint - speedMax) < 0.001
		);
		Assert.isTrue(isSpeedXYMaxAfterConstraint);

		var isSpeedZEqualAfterConstraint =
		(
			speedZAfterConstraint == speedZBeforeConstraint
		);
		Assert.isTrue(isSpeedZEqualAfterConstraint);
	}

	stopBelowSpeedMin(): void
	{
		var speedMin = .1;
		var constraint = new Constraint_StopBelowSpeedMin(speedMin);
		this._constrainable.clear().constraintAdd(constraint);

		var entityVel = this._entityToConstrainLoc.vel;

		var speedBeforeConstraint = 1;
		entityVel.overwriteWithDimensions(1, 0, 0).multiplyScalar
		(
			speedBeforeConstraint
		);
		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);
		var speedAfterConstraint = entityVel.magnitude();
		Assert.isTrue(speedAfterConstraint == speedBeforeConstraint);

		var speedBeforeConstraint = speedMin - 0.000001;
		entityVel.overwriteWithDimensions(1, 0, 0).multiplyScalar
		(
			speedBeforeConstraint
		);
		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);
		var speedAfterConstraint = entityVel.magnitude();
		Assert.isTrue(speedAfterConstraint == 0);
	}

	trimToPlaceSize(): void
	{
		var placeSize = this._place.size;

		var constraint = new Constraint_TrimToPlaceSize();
		this._constrainable.clear().constraintAdd(constraint);

		var entityPos = this._entityToConstrainLoc.pos;

		var entityPosBeforeConstraint =
			entityPos.overwriteWith(placeSize).half().clone();
		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);
		var entityPosAfterConstraint = entityPos;
		Assert.areEqual(entityPosBeforeConstraint, entityPosAfterConstraint);

		var entityPosBeforeConstraint =
			entityPos.overwriteWith(placeSize).double().clone();
		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);
		var entityPosAfterConstraint = entityPos;
		Assert.areEqual(placeSize, entityPosAfterConstraint);
	}

	wrapToPlaceSize(): void
	{
		var placeSize = this._place.size;

		var constraint = new Constraint_WrapToPlaceSize();
		this._constrainable.clear().constraintAdd(constraint);

		var entityPos = this._entityToConstrainLoc.pos;

		var entityPosBeforeConstraint =
			entityPos.overwriteWith(placeSize).half().clone();
		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);
		var entityPosAfterConstraint = entityPos;
		Assert.areEqual(entityPosBeforeConstraint, entityPosAfterConstraint);

		var entityPosBeforeConstraint =
			entityPos.overwriteWith(placeSize).double().clone();
		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);
		var entityPosAfterConstraint = entityPos;
		var zeroes = Coords.create();
		Assert.areEqual(zeroes, entityPosAfterConstraint);
	}

	wrapToPlaceSizeX(): void
	{
		var placeSize = this._place.size;

		var constraint = new Constraint_WrapToPlaceSizeX();
		this._constrainable.clear().constraintAdd(constraint);

		var entityPos = this._entityToConstrainLoc.pos;

		var entityPosBeforeConstraint =
			entityPos.overwriteWith(placeSize).half().clone();
		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);
		var entityPosAfterConstraint = entityPos;
		Assert.areEqual(entityPosBeforeConstraint, entityPosAfterConstraint);

		var entityPosBeforeConstraint =
			entityPos.overwriteWith(placeSize).double().clone();
		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);
		var entityPosAfterConstraint = entityPos;
		Assert.areEqual
		(
			0, entityPosAfterConstraint.x
		);

		Assert.areEqual
		(
			entityPosBeforeConstraint.y, entityPosAfterConstraint.y
		);

		Assert.areEqual
		(
			entityPosBeforeConstraint.z, entityPosAfterConstraint.z
		);
	}

	wrapToPlaceSizeXTrimY(): void
	{
		var placeSize = this._place.size;

		var constraint = new Constraint_WrapToPlaceSizeXTrimY();
		this._constrainable.clear().constraintAdd(constraint);

		var entityPos = this._entityToConstrainLoc.pos;

		var entityPosBeforeConstraint =
			entityPos.overwriteWith(placeSize).half().clone();
		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);
		var entityPosAfterConstraint = entityPos;
		Assert.areEqual(entityPosBeforeConstraint, entityPosAfterConstraint);

		var entityPosBeforeConstraint =
			entityPos.overwriteWith(placeSize).double().clone();
		constraint.constrain
		(
			this._universe, this._world, this._place, this._entityToConstrain
		);
		var entityPosAfterConstraint = entityPos;

		Assert.areEqual
		(
			0, entityPosAfterConstraint.x
		);

		Assert.areEqual
		(
			placeSize.y, entityPosAfterConstraint.y
		);

		Assert.areEqual
		(
			entityPosBeforeConstraint.z, entityPosAfterConstraint.z
		);
	}
}
