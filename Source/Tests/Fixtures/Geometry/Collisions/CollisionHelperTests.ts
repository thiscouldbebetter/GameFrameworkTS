
class CollisionHelperTests extends TestFixture
{
	_collisionHelper: CollisionHelper;

	_boxOfSide1AtOrigin: BoxAxisAligned;
	_boxOfSide2AtOrigin: BoxAxisAligned;
	_boxOfSide3AtOrigin: BoxAxisAligned;
	_boxOfSide1AtX1: BoxAxisAligned;
	_boxOfSide1AtX2: BoxAxisAligned;
	_sphereOfRadius1AtOrigin: Sphere

	constructor()
	{
		super(CollisionHelperTests.name);
		var mockEnvironment = new MockEnvironment();
		var universe = mockEnvironment.universe;
		this._collisionHelper = universe.collisionHelper;

		// Test colliders.

		this._boxOfSide1AtOrigin = BoxAxisAligned.fromCenterAndSize
		(
			Coords.zeroes(), // center
			Coords.ones() // size
		);

		this._boxOfSide2AtOrigin = BoxAxisAligned.fromCenterAndSize
		(
			Coords.zeroes(), // center
			Coords.ones().double() // size
		);

		this._boxOfSide3AtOrigin = BoxAxisAligned.fromCenterAndSize
		(
			Coords.zeroes(), // center
			Coords.ones().multiplyScalar(3) // size
		);

		this._boxOfSide1AtX1 = BoxAxisAligned.fromCenterAndSize
		(
			Coords.fromXYZ(1, 0, 0), // center
			Coords.ones() // size
		);

		this._boxOfSide1AtX2 = BoxAxisAligned.fromCenterAndSize
		(
			Coords.fromXYZ(2, 0, 0), // origin
			Coords.ones() // size
		);
		
		this._sphereOfRadius1AtOrigin = Sphere.fromRadiusAndCenter
		(
			1, Coords.zeroes() // center
		);
	}

	tests(): Test[]
	{
		var testRuns =
		[
			this.collisionActiveClosest,
			this.collisionOfEntities,
			this.collisionOfColliders,

			/*
			// todo - Some tests not yet implemented. 
			this.collisionsOfEntitiesCollidableInSets,
			*/

			this.doEntitiesCollide,
			this.doCollidersCollide,
			this.doesColliderContainOther,

			// Shapes.

			/*
			// collideEntitiesXAndY

			this.collideEntitiesBackUp,
			this.collideEntitiesBlock,
			this.collideEntitiesBounce,
			this.collideEntitiesBlockOrBounce,
			this.collideEntitiesSeparate,
			*/

			// collisionOfXAndY

			this.collisionOfBoxAndBox,
			// this.collisionOfBoxAndBoxRotated,
			// this.collisionOfBoxAndMapLocated,
			// this.collisionOfBoxAndMesh,
			this.collisionOfBoxAndSphere,
			// this.collisionOfBoxRotatedAndBox,
			// this.collisionOfBoxRotatedAndBoxRotated,
			// this.collisionOfBoxRotatedAndMapLocated,
			// this.collisionOfBoxRotatedAndSphere,
			this.collisionOfEdgeAndEdge,
			// this.collisionOfEdgeAndFace,
			// this.collisionsOfEdgeAndMesh,
			// this.collisionOfEdgeAndPlane,
			// this.collisionOfHemispaceAndBox,
			// this.collisionOfHemispaceAndSphere,
			// this.collisionOfMapLocatedAndBox,
			// this.collisionOfMapLocatedAndBoxRotated,
			// this.collisionOfMapLocatedAndMapLocated,
			// this.collisionOfMapLocatedAndSphere,
			// this.collisionOfMeshAndBox,
			// this.collisionOfMeshAndSphere,
			// this.collisionOfShapeAndShapeGroupAll,
			// this.collisionOfShapeAndShapeInverse,
			// this.collisionOfShapeGroupAllAndShape,
			// this.collisionOfShapeInverseAndShape,
			// this.collisionOfSphereAndBox,
			// this.collisionOfSphereAndBoxRotated,
			// this.collisionOfSphereAndMapLocated,
			// this.collisionOfSphereAndMesh,
			// this.collisionOfSpheres,

			// doXAndYCollide

			this.doBoxAndBoxCollide,

			/*
			this.doBoxAndBoxRotatedCollide,
			this.doBoxAndCylinderCollide,
			this.doBoxAndHemispaceCollide,
			this.doBoxAndMapLocatedCollide,
			this.doBoxAndMeshCollide,
			this.doBoxAndShapeInverseCollide,
			this.doBoxAndShapeGroupAllCollide,
			this.doBoxAndSphereCollide,
			this.doBoxRotatedAndBoxCollide,
			this.doBoxRotatedAndBoxRotatedCollide,
			this.doBoxRotatedAndMapLocatedCollide,
			this.doBoxRotatedAndSphereCollide,
			this.doCylinderAndCylinderCollide,
			this.doEdgeAndFaceCollide,
			this.doEdgeAndHemispaceCollide,
			this.doEdgeAndMeshCollide,
			this.doEdgeAndPlaneCollide,
			this.doHemispaceAndBoxCollide,
			this.doHemispaceAndSphereCollide,
			this.doMeshAndBoxCollide,
			this.doMeshAndMeshCollide,
			this.doMeshAndShapeInverseCollide,
			this.doMapLocatedAndBoxCollide,
			this.doMapLocatedAndBoxRotatedCollide,
			this.doMapLocatedAndMapLocatedCollide,
			this.doMapLocatedAndSphereCollide,
			this.doMeshAndSphereCollide,
			this.doSphereAndBoxCollide,
			this.doSphereAndMapLocatedCollide,
			this.doSphereAndMeshCollide,
			this.doSphereAndBoxRotatedCollide,
			this.doSphereAndShapeContainerCollide,
			this.doSphereAndShapeGroupAllCollide,
			this.doSphereAndShapeGroupAnyCollide,
			this.doSphereAndShapeInverseCollide,
			this.doSphereAndSphereCollide,

			// boolean combinations

			this.doShapeGroupAllAndBoxCollide,
			this.doShapeGroupAllAndShapeCollide,
			this.doShapeGroupAllAndMeshCollide,
			this.doShapeGroupAnyAndBoxCollide,
			this.doShapeGroupAnyAndShapeCollide,
			this.doShapeContainerAndShapeCollide,
			this.doShapeContainerAndBoxCollide,
			this.doShapeInverseAndMeshCollide,
			this.doShapeInverseAndShapeCollide,
			this.doShapeGroupAllAndSphereCollide,
			this.doBoxAndShapeGroupAnyCollide,
			this.doShapeContainerAndSphereCollide,
			this.doShapeGroupAnyAndSphereCollide,
			this.doShapeInverseAndBoxCollide,
			this.doShapeInverseAndSphereCollide,

			// contains

			this.doesBoxContainBox,
			this.doesBoxContainHemispace,
			this.doesBoxContainSphere,
			this.doesHemispaceContainBox,
			this.doesHemispaceContainSphere,
			this.doesSphereContainBox,
			this.doesSphereContainHemispace,
			this.doesSphereContainSphere

			*/

		];

		var tests = testRuns.map(x => Test.fromRun(x) );

		return tests;
	}

	collisionActiveClosest(): void
	{
		var posNear = Coords.fromXY(1, 0);
		var posMidrange = Coords.fromXY(2, 0);
		var posFar = Coords.fromXY(3, 0);

		var collisionNear = Collision.fromPosAndDistance(posNear, posNear.x);
		var collisionMidrange = Collision.fromPosAndDistance(posMidrange, posMidrange.x);
		var collisionFar = Collision.fromPosAndDistance(posFar, posFar.x);

		var collisionsToCheck =
			[ collisionNear, collisionMidrange, collisionFar ];

		collisionsToCheck.forEach(x => x.isActive = true);

		var collisionActiveClosest =
			this._collisionHelper.collisionActiveClosest(collisionsToCheck);

		Assert.areEqual(collisionNear, collisionActiveClosest);
	}

	collisionOfEntities(): void
	{
		var colliderRadius = 10;
		var collider = Sphere.fromRadiusAndCenter(colliderRadius, Coords.create() );
		var entity0 = Entity.fromNameAndProperties
		(
			"Entity0",
			[
				Collidable.fromCollider(collider),
				Locatable.fromPos(Coords.create())
			]
		);

		var entity1Pos = Coords.create();
		var entity1 = Entity.fromNameAndProperties
		(
			"Entity1",
			[
				Collidable.fromCollider(collider),
				Locatable.fromPos(entity1Pos)
			]
		);

		var collision = this._collisionHelper.collisionOfEntities
		(
			entity0, entity1, Collision.create()
		);
		Assert.areEqual(entity1Pos, collision.pos);
	}

	collisionOfColliders(): void
	{
		var colliderRadius = 10;
		var collider0 = Sphere.fromRadiusAndCenter(colliderRadius, Coords.create() );
		var collider1 = Sphere.fromRadiusAndCenter(colliderRadius, Coords.create() );

		var collision = this._collisionHelper.collisionOfColliders
		(
			collider0, collider1, Collision.create()
		);
		Assert.areEqual(collider0.center, collision.pos);
	}

	collisionsOfEntitiesCollidableInSets(): void
	{
		// todo
		// entitiesCollidable0: Entity[], entitiesCollidable1: Entity[]
	}

	doEntitiesCollide(): void
	{
		var entity0 = new Entity
		(
			"Entity0",
			[
				Collidable.fromCollider(this._boxOfSide1AtOrigin)
			]
		);

		var entity1 = new Entity
		(
			"Entity1",
			[
				Collidable.fromCollider(this._boxOfSide2AtOrigin)
			]
		);

		var doEntitiesCollide =
			this._collisionHelper.doEntitiesCollide(entity0, entity1);

		Assert.isTrue(doEntitiesCollide);
	}

	doCollidersCollide(): void
	{
		var collider0 = this._boxOfSide1AtOrigin;
		var collider1 = this._boxOfSide2AtOrigin;

		var doCollidersCollide =
			this._collisionHelper.doCollidersCollide(collider0, collider1);

		Assert.isTrue(doCollidersCollide);
	}

	doesColliderContainOther(): void
	{
		var colliderContained = this._boxOfSide1AtOrigin;
		var colliderContaining = this._boxOfSide2AtOrigin;

		Assert.isTrue
		(
			this._collisionHelper.doesColliderContainOther
			(
				colliderContaining, colliderContained
			)
		);

		Assert.isFalse
		(
			this._collisionHelper.doesColliderContainOther
			(
				colliderContained, colliderContaining
			)
		);
	}

	// Shapes.

	// collideEntitiesXAndY

	collideEntitiesBackUp(): void
	{
		// todo
		// entity0: Entity, entity1: Entity
	}

	collideEntitiesBlock(): void
	{
		// todo
		// entity0: Entity, entity1: Entity
	}

	collideEntitiesBounce(): void
	{
		// todo
		// entity0: Entity, entity1: Entity
	}

	collideEntitiesBlockOrBounce(): void
	{
		// todo
		// entity0: Entity, entity1: Entity, coefficientOfRestitution: number
	}

	collideEntitiesSeparate(): void
	{
		// todo
		// entity0: Entity, entity1: Entity
	}

	// collisionOfXAndY

	collisionOfBoxAndBox(): void
	{
		var collision = this._collisionHelper.collisionOfBoxAndBox
		(
			this._boxOfSide1AtOrigin, this._boxOfSide2AtOrigin,
			Collision.create()
		);

		Assert.isTrue(collision.isActive);
	}

	collisionOfBoxAndBoxRotated(): void
	{
		// todo
		// box: Box, boxRotated: BoxRotated, collision: Collision, shouldCalculatePos: boolean
	}

	collisionOfBoxAndMapLocated(): void
	{
		// todo
		// box: Box, mapLocated: MapLocated, collision: Collision
	}

	collisionOfBoxAndMesh(): void
	{
		// todo
		// box: Box, mesh: Mesh, collision: Collision
	}

	collisionOfBoxAndSphere(): void
	{
		var collision = this._collisionHelper.collisionOfBoxAndSphere
		(
			this._boxOfSide1AtOrigin, this._sphereOfRadius1AtOrigin,
			Collision.create(), true // shouldCalculatePos
		);

		Assert.isTrue(collision.isActive);
	}

	collisionOfBoxRotatedAndBox(): void
	{
		// todo
		// boxRotated: BoxRotated, box: Box, collision: Collision, shouldCalculatePos: boolean
	}

	collisionOfBoxRotatedAndBoxRotated(): void
	{
		// todo
		// boxRotated0: BoxRotated, boxRotated1: BoxRotated, collision: Collision, shouldCalculatePos: boolean
	}

	collisionOfBoxRotatedAndMapLocated(): void
	{
		// todo
		// boxRotated: BoxRotated, mapLocated: MapLocated, collision: Collision, shouldCalculatePos: boolean
	}

	collisionOfBoxRotatedAndSphere(): void
	{
		// todo
		// boxRotated: BoxRotated, sphere: Sphere, collision: Collision, shouldCalculatePos: boolean
	}

	collisionOfEdgeAndEdge(): void
	{
		var edge0 = Edge.fromVertex0And1(Coords.fromXY(0, 0), Coords.fromXY(1, 1));
		var edge1 = Edge.fromVertex0And1(Coords.fromXY(0, 1), Coords.fromXY(1, 0))

		var collision = this._collisionHelper.collisionOfEdgeAndEdge
		(
			edge0, edge1, Collision.create()
		);

		Assert.isTrue(collision.isActive);
	}

	collisionOfEdgeAndFace(): void
	{
		// todo
		// edge: Edge, face: Face, collision: Collision
	}

	collisionsOfEdgeAndMesh(): void
	{
		// todo
		// edge: Edge, mesh: Mesh, collisions: Collision[], stopAfterFirst: boolean
	}

	collisionOfEdgeAndPlane(): void
	{
		// todo
		// edge: Edge, plane: Plane, collision: Collision): Collision
	}

	collisionOfHemispaceAndBox(): void
	{
		// todo
		// hemispace: Hemispace, box: Box, collision: Collision): Collision
	}

	collisionOfHemispaceAndSphere(): void
	{
		// todo
		// hemispace: Hemispace, sphere: Sphere, collision: Collision
	}

	collisionOfMapLocatedAndBox(): void
	{
		// todo
		// mapLocated: MapLocated, box: Box, collision: Collision
	}

	collisionOfMapLocatedAndBoxRotated(): void
	{
		// todo
		/*
		mapLocated: MapLocated, boxRotated: BoxRotated,
		collision: Collision, shouldCalculateCollisionPos: boolean
		*/
	}

	collisionOfMapLocatedAndMapLocated(): void
	{
		// todo
		// mapLocated0: MapLocated, mapLocated1: MapLocated, collision: Collision
	}

	collisionOfMapLocatedAndSphere(): void
	{
		// todo
		// mapLocated: MapLocated, sphere: Sphere, collision: Collision
	}

	collisionOfMeshAndBox(): void
	{
		// todo
		// mesh: Mesh, box: Box, collision: Collision): Collision
	}

	collisionOfMeshAndSphere(): void
	{
		// todo
		// mesh: Mesh, sphere: Sphere, collision: Collision): Collision
	}

	collisionOfShapeAndShapeGroupAll(): void
	{
		// todo
		// shape: ShapeBase, shapeGroupAll: ShapeGroupAll, collisionOut: Collision): Collision
	}

	collisionOfShapeAndShapeInverse(): void
	{
		// todo
		// shape: ShapeBase, shapeInverse: ShapeInverse, collisionOut: Collision): Collision
	}

	collisionOfShapeGroupAllAndShape(): void
	{
		// todo
		// shapeGroupAll: ShapeGroupAll, shape: any, collisionOut: Collision): Collision
	}

	collisionOfShapeInverseAndShape(): void
	{
		// todo
		// shapeInverse: ShapeInverse, shape: any, collisionOut: Collision): Collision
	}

	collisionOfSphereAndBox(): void
	{
		// todo
		// sphere: Sphere, box: Box, collision: Collision, shouldCalculatePos: boolean): Collision
	}

	collisionOfSphereAndBoxRotated(): void
	{
		// todo
		// sphere: Sphere, boxRotated: BoxRotated, collision: Collision, shouldCalculatePos: boolean): Collision
	}

	collisionOfSphereAndMapLocated(): void
	{
		// todo
		// sphere: Sphere, mapLocated: MapLocated, collision: Collision): Collision
	}

	collisionOfSphereAndMesh(): void
	{
		// todo
		// sphere: Sphere, mesh: Mesh, collision: Collision): Collision
	}

	collisionOfSpheres(): void
	{
		var sphere0 = Sphere.fromRadiusAndCenter(1, Coords.zeroes() );
		var sphere1 = Sphere.fromRadiusAndCenter(1, new Coords(1, 0, 0) );

		var collision = this._collisionHelper.collisionOfSpheres
		(
			sphere0, sphere1, Collision.create()
		);

		Assert.isTrue(collision.isActive);
	}

	// doXAndYCollide

	doBoxAndBoxCollide(): void
	{
		// First, three concentric boxes at origin all collide with each other.

		var doBoxesCollide = this._collisionHelper.doBoxAndBoxCollide
		(
			this._boxOfSide1AtOrigin, this._boxOfSide2AtOrigin
		);
		Assert.isTrue(doBoxesCollide);

		doBoxesCollide = this._collisionHelper.doBoxAndBoxCollide
		(
			this._boxOfSide1AtOrigin, this._boxOfSide3AtOrigin
		);
		Assert.isTrue(doBoxesCollide);

		doBoxesCollide = this._collisionHelper.doBoxAndBoxCollide
		(
			this._boxOfSide2AtOrigin, this._boxOfSide3AtOrigin
		);
		Assert.isTrue(doBoxesCollide);

		// These boxes touch, but don't collide.

		doBoxesCollide = this._collisionHelper.doBoxAndBoxCollide
		(
			this._boxOfSide1AtOrigin, this._boxOfSide1AtX1
		);
		Assert.isFalse(doBoxesCollide);

		// These boxes don't even touch, much less collide

		doBoxesCollide = this._collisionHelper.doBoxAndBoxCollide
		(
			this._boxOfSide1AtOrigin, this._boxOfSide1AtX2
		);
		Assert.isFalse(doBoxesCollide);
	}

	doBoxAndBoxRotatedCollide(): void
	{
		// todo
		// box: Box, boxRotated: BoxRotated): boolean
	}

	doBoxAndCylinderCollide(): void
	{
		// todo
		// box: Box, cylinder: Cylinder): boolean
	}

	doBoxAndHemispaceCollide(): void
	{
		// todo
		// box: Box, hemispace: Hemispace): boolean
	}

	doBoxAndMapLocatedCollide(): void
	{
		// todo
		// box: Box, mapLocated: MapLocated): boolean
	}

	doBoxAndMeshCollide(): void
	{
		// todo - box: Box, mesh: Mesh): boolean
	}

	doBoxAndShapeInverseCollide(): void
	{
		// todo - box: Box, shapeInverse: ShapeInverse): boolean
	}

	doBoxAndShapeGroupAllCollide(): void
	{
		// todo - box: Box, shapeGroupAll: ShapeGroupAll): boolean
	}

	doBoxAndSphereCollide(): void
	{
		// todo - box: Box, sphere: Sphere): boolean
	}

	doBoxRotatedAndBoxCollide(): void
	{
		// todo - boxRotated: BoxRotated, box: Box): boolean
	}

	doBoxRotatedAndBoxRotatedCollide(): void
	{
		// todo - boxRotated0: BoxRotated, boxRotated1: BoxRotated): boolean
	}

	doBoxRotatedAndMapLocatedCollide(): void
	{
		// todo - boxRotated: BoxRotated, mapLocated: MapLocated): boolean
	}

	doBoxRotatedAndSphereCollide(): void
	{
		// todo - boxRotated: BoxRotated, sphere: Sphere): boolean
	}

	doCylinderAndCylinderCollide(): void
	{
		// todo - cylinder0: Cylinder, cylinder1: Cylinder): boolean
	}

	doEdgeAndFaceCollide(): void
	{
		// todo - edge: Edge, face: Face, collision: Collision): boolean
	}

	doEdgeAndHemispaceCollide(): void
	{
		// todo - edge: Edge, hemispace: Hemispace): boolean
	}

	doEdgeAndMeshCollide(): void
	{
		// todo - edge: Edge, mesh: Mesh): boolean
	}

	doEdgeAndPlaneCollide(): void
	{
		// todo - edge: Edge, plane: Plane): boolean
	}

	doHemispaceAndBoxCollide(): void
	{
		// todo - hemispace: Hemispace, box: Box): boolean
	}

	doHemispaceAndSphereCollide(): void
	{
		// todo - hemispace: Hemispace, sphere: Sphere): boolean
	}

	doMeshAndBoxCollide(): void
	{
		// todo - mesh: Mesh, box: Box): boolean
	}

	doMeshAndMeshCollide(): void
	{
		// todo - mesh0: Mesh, mesh1: Mesh): boolean
	}

	doMeshAndShapeInverseCollide(): void
	{
		// todo - mesh: Mesh, inverse: ShapeInverse): boolean
	}

	doMapLocatedAndBoxCollide(): void
	{
		// todo - mapLocated: MapLocated, box: Box): boolean
	}

	doMapLocatedAndBoxRotatedCollide(): void
	{
		// todo - mapLocated: MapLocated, boxRotated: BoxRotated): boolean
	}

	doMapLocatedAndMapLocatedCollide(): void
	{
		// todo - mapLocated0: MapLocated, mapLocated1: MapLocated): boolean
	}

	doMapLocatedAndSphereCollide(): void
	{
		// todo - mapLocated: MapLocated, sphere: Sphere): boolean
	}

	doMeshAndSphereCollide(): void
	{
		// todo - mesh: Mesh, sphere: Sphere): boolean
	}

	doSphereAndBoxCollide(): void
	{
		// todo - sphere: Sphere, box: Box): boolean
	}

	doSphereAndMapLocatedCollide(): void
	{
		// todo - sphere: Sphere, mapLocated: MapLocated): boolean
	}

	doSphereAndMeshCollide(): void
	{
		// todo - sphere: Sphere, mesh: Mesh): boolean
	}

	doSphereAndBoxRotatedCollide(): void
	{
		// todo - sphere: Sphere, boxRotated: BoxRotated): boolean
	}

	doSphereAndShapeContainerCollide(): void
	{
		// todo - sphere: Sphere, shapeContainer: ShapeContainer): boolean
	}

	doSphereAndShapeGroupAllCollide(): void
	{
		// todo - sphere: Sphere, shapeGroupAll: ShapeGroupAll): boolean
	}

	doSphereAndShapeGroupAnyCollide(): void
	{
		// todo - sphere: Sphere, shapeGroupAny: ShapeGroupAny): boolean
	}

	doSphereAndShapeInverseCollide(): void
	{
		// todo - sphere: Sphere, shapeInverse: ShapeInverse): boolean
	}

	doSphereAndSphereCollide(): void
	{
		// todo - sphere0: Sphere, sphere1: Sphere): boolean
	}

	// boolean combinations

	doShapeGroupAllAndBoxCollide(): void
	{
		// todo - groupAll: ShapeGroupAll, shapeOther: ShapeBase): boolean
	}

	doShapeGroupAllAndShapeCollide(): void
	{
		// todo - groupAll: ShapeGroupAll, shapeOther: ShapeBase): boolean
	}

	doShapeGroupAllAndMeshCollide(): void
	{
		// todo - groupAll: ShapeGroupAll, mesh: Mesh): boolean
	}

	doShapeGroupAnyAndBoxCollide(): void
	{
		// todo - groupAny: ShapeGroupAny, box: Box): boolean
	}

	doShapeGroupAnyAndShapeCollide(): void
	{
		// todo - groupAny: ShapeGroupAny, shapeOther: ShapeBase): boolean
	}

	doShapeContainerAndShapeCollide(): void
	{
		// todo - container: ShapeContainer, shapeOther: ShapeBase): boolean
	}

	doShapeContainerAndBoxCollide(): void
	{
		// todo - container: ShapeContainer, box: Box): boolean
	}

	doShapeInverseAndMeshCollide(): void
	{
		// todo - inverse: ShapeInverse, mesh: Mesh): boolean
	}

	doShapeInverseAndShapeCollide(): void
	{
		// todo - inverse: ShapeInverse, shapeOther: ShapeBase): boolean
	}

	doShapeGroupAllAndSphereCollide(): void
	{
		// todo - group: ShapeGroupAll, shape: ShapeBase): boolean
	}

	doBoxAndShapeGroupAnyCollide(): void
	{
		// todo - box: Box, group: ShapeGroupAny): boolean
	}

	doShapeContainerAndSphereCollide(): void
	{
		// todo - container: ShapeContainer, sphere: Sphere): boolean
	}

	doShapeGroupAnyAndSphereCollide(): void
	{
		// todo - group: ShapeGroupAny, sphere: Sphere): boolean
	}

	doShapeInverseAndBoxCollide(): void
	{
		// todo - inverse: ShapeInverse, box: Box): boolean
	}

	doShapeInverseAndSphereCollide(): void
	{
		// todo - inverse: ShapeInverse, sphere: Sphere): boolean
	}

	// contains

	doesBoxContainBox(): void
	{
		// todo - box0: Box, box1: Box): boolean
	}

	doesBoxContainHemispace(): void
	{
		// todo - box: Box, hemispace: Hemispace
	}

	doesBoxContainSphere(): void
	{
		// todo - box: Box, sphere: Sphere): boolean
	}

	doesHemispaceContainBox(): void
	{
		// todo - hemispace: Hemispace, box: Box): boolean
	}

	doesHemispaceContainSphere(): void
	{
		// todo - hemispace: Hemispace, sphere: Sphere): boolean
	}

	doesSphereContainBox(): void
	{
		var sphere = Sphere.fromRadiusAndCenter(2, Coords.zeroes() );
		var box = BoxAxisAligned.fromSizeAndCenter
		(
			Coords.ones(), Coords.zeroes()
		);

		var doesSphereContainBox =
			this._collisionHelper.doesSphereContainBox(sphere, box);

		Assert.isTrue(doesSphereContainBox);
	}

	doesSphereContainHemispace(): void
	{
		var sphere = Sphere.fromRadiusAndCenter(1, Coords.zeroes() );
		var hemispace = new Hemispace
		(
			new Plane(new Coords(1, 0, 0), 0)
		);

		var doesSphereContainHemispace =
			this._collisionHelper.doesSphereContainHemispace(sphere, hemispace);

		// A hemispace infinitely large, so no sphere will ever contain it.
		Assert.isFalse(doesSphereContainHemispace);
	}

	doesSphereContainSphere(): void
	{
		var sphereContained = Sphere.fromRadiusAndCenter(1, Coords.zeroes() );
		var sphereContaining = Sphere.fromRadiusAndCenter(2, Coords.zeroes() );

		Assert.isTrue
		(
			this._collisionHelper.doesSphereContainSphere
			(
				sphereContaining, sphereContained
			)
		);

		Assert.isFalse
		(
			this._collisionHelper.doesSphereContainSphere
			(
				sphereContained, sphereContaining
			)
		);
	}
}
