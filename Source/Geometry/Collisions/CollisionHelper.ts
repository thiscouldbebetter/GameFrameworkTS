
namespace ThisCouldBeBetter.GameFramework
{

export class CollisionHelper
{
	throwErrorIfCollidersCannotBeCollided: boolean;
	doCollideByColliderTypeNameByColliderTypeName: Map<string, Map<string, any> >;
	doesContainByColliderTypeNameByColliderTypeName: Map<string, Map<string, any> >;
	collisionFindByColliderTypeNameByColliderTypeName: Map<string, Map<string, any> >;

	_box: BoxAxisAligned;
	_box2: BoxAxisAligned;
	_collision: Collision;
	_displacement: Coords;
	_edge: Edge;
	_mapCells: MapCell[];
	_polar: Polar;
	_pos: Coords;
	_range: RangeExtent;
	_range2: RangeExtent;
	_size: Coords;
	_vel: Coords;
	_vel2: Coords;

	constructor()
	{
		this.throwErrorIfCollidersCannotBeCollided = false; // true;

		this.doCollideByColliderTypeNameByColliderTypeName =
			this.doCollideLookupBuild();
		this.doesContainByColliderTypeNameByColliderTypeName =
			this.doesContainLookupBuild();
		this.collisionFindByColliderTypeNameByColliderTypeName =
			this.collisionFindLookupBuild();

		// Helper variables.
		this._box = BoxAxisAligned.create();
		this._box2 = BoxAxisAligned.create();
		this._collision = Collision.create();
		this._displacement = Coords.create();
		this._edge = Edge.create();
		this._mapCells = [];
		this._polar = Polar.create();
		this._pos = Coords.create();
		this._range = RangeExtent.create();
		this._range2 = RangeExtent.create();
		this._size = Coords.create();
		this._vel = Coords.create();
		this._vel2 = Coords.create();
	}

	// constructor helpers

	collisionFindLookupBuild(): Map<string, Map<string, any> >
	{
		var lookupOfLookups = new Map<string, Map<string, any> >();
		var lookup: Map<string, any>;

		var notDefined = "undefined"; // todo

		var boxName = ( typeof BoxAxisAligned == notDefined ? null : BoxAxisAligned.name );
		var mapLocatedName = ( typeof MapLocated == notDefined ? null : MapLocated.name );
		var mapLocated2Name = ( typeof MapLocated2 == notDefined ? null : MapLocated2.name );
		var meshName = ( typeof Mesh == notDefined ? null : Mesh.name );
		var pointName = (typeof Point == notDefined ? null : Point.name );
		var shapeGroupAllName = (typeof ShapeGroupAll == notDefined ? null : ShapeGroupAll.name);
		var shapeGroupAnyName = (typeof ShapeGroupAny == notDefined ? null : ShapeGroupAny.name);
		var shapeInverseName = (typeof ShapeInverse == notDefined ? null : ShapeInverse.name);
		var shapeTransformedName = (typeof ShapeTransformed == notDefined ? null : ShapeTransformed.name);
		var sphereName = ( typeof Sphere == notDefined ? null : Sphere.name );

		if (boxName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.collisionOfBoxAndBox ],
				[ mapLocatedName, this.collisionOfBoxAndMapLocated ],
				[ mapLocated2Name, this.collisionOfBoxAndMapLocated ],
				[ meshName, this.collisionOfBoxAndMesh ],
				[ shapeGroupAllName, this.collisionOfShapeAndShapeGroupAll ],
				[ shapeGroupAnyName, this.collisionOfShapeAndShapeGroupAny ],
				[ shapeInverseName, this.collisionOfShapeAndShapeInverse ],
				[ shapeTransformedName, this.collisionOfShapeAndShapeTransformed ],
				[ sphereName, this.collisionOfBoxAndSphere ]
			]);
			lookupOfLookups.set(boxName, lookup);
		}

		if (mapLocatedName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.collisionOfMapLocatedAndBox ],
				[ mapLocatedName, this.collisionOfMapLocatedAndMapLocated ],
				[ shapeGroupAllName, this.collisionOfShapeAndShapeGroupAll ],
				[ sphereName, this.collisionOfMapLocatedAndSphere ]
			]);
			lookupOfLookups.set(mapLocatedName, lookup);
		}

		if (meshName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.collisionOfMeshAndBox ],
				[ shapeGroupAllName, this.collisionOfShapeAndShapeGroupAll ],
				[ shapeInverseName, this.collisionOfShapeAndShapeInverse ],
				[ sphereName, this.collisionOfMeshAndSphere ]
			]);
			lookupOfLookups.set(meshName, lookup);
		}

		if (pointName != null)
		{
			lookup = new Map<string, any>
			([
				[ pointName, this.collisionOfPointAndPoint ],
			]);
			lookupOfLookups.set(pointName, lookup);
		}

		if (shapeGroupAllName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.collisionOfShapeGroupAllAndShape ],
				[ meshName, this.collisionOfShapeGroupAllAndShape ],
				[ sphereName, this.collisionOfShapeGroupAllAndShape ]
			]);
			lookupOfLookups.set(shapeGroupAllName, lookup);
		}

		if (shapeGroupAnyName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.collisionOfShapeGroupAnyAndShape ],
				[ meshName, this.collisionOfShapeGroupAnyAndShape ],
				[ shapeGroupAnyName, this.collisionOfShapeGroupAnyAndShape ],
				[ shapeTransformedName, this.collisionOfShapeGroupAnyAndShape ],
				[ sphereName, this.collisionOfShapeGroupAnyAndShape ]
			]);
			lookupOfLookups.set(shapeGroupAnyName, lookup);
		}

		if (shapeInverseName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.collisionOfShapeInverseAndShape ],
				[ meshName, this.collisionOfShapeInverseAndShape ],
				[ sphereName, this.collisionOfShapeInverseAndShape ]
			]);
			lookupOfLookups.set(shapeInverseName, lookup);
		}

		if (shapeTransformedName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.collisionOfShapeTransformedAndShape ],
				[ meshName, this.collisionOfShapeTransformedAndShape ],
				[ shapeGroupAnyName, this.collisionOfShapeTransformedAndShape ],
				[ shapeTransformedName, this.collisionOfShapeTransformedAndShape ],
				[ sphereName, this.collisionOfShapeTransformedAndShape ]
			]);
			lookupOfLookups.set(shapeTransformedName, lookup);
		}

		if (sphereName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.collisionOfSphereAndBox ],
				[ mapLocatedName, this.collisionOfSphereAndMapLocated ],
				[ meshName, this.collisionOfSphereAndMesh ],
				[ shapeGroupAllName, this.collisionOfShapeAndShapeGroupAll ],
				[ shapeGroupAnyName, this.collisionOfShapeAndShapeGroupAny ],
				[ shapeInverseName, this.collisionOfShapeAndShapeInverse ],
				[ shapeTransformedName, this.collisionOfShapeAndShapeTransformed ],
				[ sphereName, this.collisionOfSpheres ]
			]);
			lookupOfLookups.set(sphereName, lookup);
		}

		return lookupOfLookups;
	}

	doCollideLookupBuild(): Map<string, Map<string, any> >
	{
		var lookupOfLookups = new Map<string, Map<string, any> >();
		var lookup: Map<string, any>;

		var notDefined = "undefined"; // todo

		var boxName = ( typeof BoxAxisAligned == notDefined ? null : BoxAxisAligned.name );
		var hemispaceName = (typeof Hemispace == notDefined ? null : Hemispace.name );
		var mapLocatedName = ( typeof MapLocated == notDefined ? null : MapLocated.name );
		var mapLocated2Name = ( typeof MapLocated2 == notDefined ? null : MapLocated2.name );
		var meshName = ( typeof Mesh == notDefined ? null : Mesh.name );
		var pointName = (typeof Point == notDefined ? null : Point.name );
		var shapeContainerName = (typeof ShapeContainer == notDefined ? null : ShapeContainer.name);
		var shapeGroupAllName = (typeof ShapeGroupAll == notDefined ? null : ShapeGroupAll.name);
		var shapeGroupAnyName = (typeof ShapeGroupAny == notDefined ? null : ShapeGroupAny.name);
		var shapeInverseName = (typeof ShapeInverse == notDefined ? null : ShapeInverse.name);
		var shapeTransformedName = (typeof ShapeTransformed == notDefined ? null : ShapeTransformed.name);
		var sphereName = ( typeof Sphere == notDefined ? null : Sphere.name );

		if (boxName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doBoxAndBoxCollide ],
				[ hemispaceName, this.doBoxAndHemispaceCollide ],
				[ mapLocatedName, this.doBoxAndMapLocatedCollide ],
				[ mapLocated2Name, this.doBoxAndMapLocatedCollide ],
				[ meshName, this.doBoxAndMeshCollide ],
				[ shapeContainerName, this.doBoxAndShapeContainerCollide ],
				[ shapeGroupAllName, this.doBoxAndShapeGroupAllCollide ],
				[ shapeGroupAnyName, this.doBoxAndShapeGroupAnyCollide ],
				[ shapeInverseName, this.doBoxAndShapeInverseCollide ],
				[ shapeTransformedName, this.doBoxAndShapeTransformedCollide ],
				[ sphereName, this.doBoxAndSphereCollide ]
			]);
			lookupOfLookups.set(boxName, lookup);
		}

		if (hemispaceName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doHemispaceAndBoxCollide ],
			]);
			lookupOfLookups.set(hemispaceName, lookup);
		}

		if (mapLocatedName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doMapLocatedAndBoxCollide ],
				[ mapLocatedName, this.doMapLocatedAndMapLocatedCollide ],
				[ shapeGroupAllName, this.doShapeAndShapeGroupAllCollide ],
				[ sphereName, this.doMapLocatedAndSphereCollide ]
			]);
			lookupOfLookups.set(mapLocatedName, lookup);
		}

		if (meshName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doMeshAndBoxCollide ],
				[ shapeGroupAllName, this.doShapeAndShapeGroupAllCollide ],
				[ shapeInverseName, this.doShapeAndShapeInverseCollide ],
				[ sphereName, this.doMeshAndSphereCollide ]
			]);
			lookupOfLookups.set(meshName, lookup);
		}

		if (pointName != null)
		{
			lookup = new Map<string, any>
			([
				[ pointName, this.doPointAndPointCollide ],
			]);
			lookupOfLookups.set(pointName, lookup);
		}

		if (shapeContainerName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doShapeContainerAndShapeCollide ],
				[ meshName, this.doShapeContainerAndShapeCollide ],
				[ sphereName, this.doShapeContainerAndShapeCollide ]
			]);
			lookupOfLookups.set(shapeContainerName, lookup);
		}

		if (shapeGroupAllName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doShapeGroupAllAndShapeCollide ],
				[ meshName, this.doShapeGroupAllAndShapeCollide ],
				[ sphereName, this.doShapeGroupAllAndShapeCollide ]
			]);
			lookupOfLookups.set(shapeGroupAllName, lookup);
		}

		if (shapeGroupAnyName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doShapeGroupAnyAndShapeCollide ],
				[ meshName, this.doShapeGroupAnyAndShapeCollide ],
				[ shapeGroupAnyName, this.doShapeGroupAnyAndShapeCollide ],
				[ shapeTransformedName, this.doShapeGroupAnyAndShapeCollide ],
				[ sphereName, this.doShapeGroupAnyAndShapeCollide ]
			]);
			lookupOfLookups.set(shapeGroupAnyName, lookup);
		}

		if (shapeInverseName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doShapeInverseAndShapeCollide ],
				[ meshName, this.doShapeInverseAndShapeCollide ],
				[ sphereName, this.doShapeInverseAndShapeCollide ]
			]);
			lookupOfLookups.set(shapeInverseName, lookup);
		}

		if (shapeTransformedName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doShapeTransformedAndShapeCollide ],
				[ meshName, this.doShapeTransformedAndShapeCollide ],
				[ shapeGroupAnyName, this.doShapeTransformedAndShapeCollide ],
				[ sphereName, this.doShapeTransformedAndShapeCollide ]
			]);
			lookupOfLookups.set(shapeTransformedName, lookup);
		}

		if (sphereName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doSphereAndBoxCollide ],
				[ mapLocatedName, this.doSphereAndMapLocatedCollide ],
				[ meshName, this.doSphereAndMeshCollide ],
				[ shapeGroupAllName, this.doShapeAndShapeGroupAllCollide ],
				[ shapeGroupAnyName, this.doShapeAndShapeGroupAnyCollide ],
				[ shapeInverseName, this.doShapeAndShapeInverseCollide ],
				[ shapeTransformedName, this.doShapeAndShapeTransformedCollide ],
				[ sphereName, this.doSphereAndSphereCollide ]
			]);
			lookupOfLookups.set(sphereName, lookup);
		}

		return lookupOfLookups;
	}

	doesContainLookupBuild(): Map<string, Map<string, any> >
	{
		var lookupOfLookups = new Map<string, Map<string, any> >();
		var lookup: Map<string, any>;

		var notDefined = "undefined"; // todo

		var boxName = ( typeof BoxAxisAligned == notDefined ? null : BoxAxisAligned.name );
		var mapLocatedName = ( typeof MapLocated == notDefined ? null : MapLocated.name );
		var mapLocated2Name = ( typeof MapLocated2 == notDefined ? null : MapLocated2.name );
		var meshName = ( typeof Mesh == notDefined ? null : Mesh.name );
		var pointName = (typeof Point == notDefined ? null : Point.name );
		var shapeGroupAllName = (typeof ShapeGroupAll == notDefined ? null : ShapeGroupAll.name);
		var shapeGroupAnyName = (typeof ShapeGroupAny == notDefined ? null : ShapeGroupAny.name);
		var shapeInverseName = (typeof ShapeInverse == notDefined ? null : ShapeInverse.name);
		var shapeTransformedName = (typeof ShapeTransformed == notDefined ? null : ShapeTransformed.name);
		var sphereName = ( typeof Sphere == notDefined ? null : Sphere.name );

		if (boxName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doesBoxContainBox ],
				[ mapLocatedName, this.doesBoxContainMapLocated ],
				[ mapLocated2Name, this.doesBoxContainMapLocated ],
				[ meshName, this.doesBoxContainMesh ],
				[ shapeGroupAllName, this.doesShapeContainShapeGroupAll ],
				[ shapeGroupAnyName, this.doesShapeContainShapeGroupAny ],
				[ shapeInverseName, this.doesShapeContainShapeInverse ],
				[ shapeTransformedName, this.doesShapeContainShapeTransformed ],
				[ sphereName, this.doesBoxContainSphere ]
			]);
			lookupOfLookups.set(boxName, lookup);
		}

		if (mapLocatedName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doesMapLocatedContainBox ],
				[ mapLocatedName, this.doesMapLocatedContainMapLocated ],
				[ shapeGroupAllName, this.doesShapeContainShapeGroupAll ],
				[ sphereName, this.doesMapLocatedContainSphere ]
			]);
			lookupOfLookups.set(mapLocatedName, lookup);
		}

		if (meshName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doesMeshContainBox ],
				[ shapeGroupAllName, this.doesShapeContainShapeGroupAll ],
				[ shapeInverseName, this.doesShapeContainShapeInverse ],
				[ sphereName, this.doesMeshContainSphere ]
			]);
			lookupOfLookups.set(meshName, lookup);
		}

		if (pointName != null)
		{
			lookup = new Map<string, any>
			([
				[ pointName, this.doesPointContainPoint ],
			]);
			lookupOfLookups.set(pointName, lookup);
		}

		if (shapeGroupAllName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doesShapeGroupAllContainShape ],
				[ meshName, this.doesShapeGroupAllContainShape ],
				[ sphereName, this.doesShapeGroupAllContainShape ]
			]);
			lookupOfLookups.set(shapeGroupAllName, lookup);
		}

		if (shapeGroupAnyName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doesShapeGroupAnyContainShape ],
				[ meshName, this.doesShapeGroupAnyContainShape ],
				[ sphereName, this.doesShapeGroupAnyContainShape ]
			]);
			lookupOfLookups.set(shapeGroupAnyName, lookup);
		}

		if (shapeInverseName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doesShapeInverseContainShape ],
				[ meshName, this.doesShapeInverseContainShape ],
				[ sphereName, this.doesShapeInverseContainShape ]
			]);
			lookupOfLookups.set(shapeInverseName, lookup);
		}

		if (shapeTransformedName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doesShapeTransformedContainShape ],
				[ meshName, this.doesShapeTransformedContainShape ],
				[ sphereName, this.doesShapeTransformedContainShape ]
			]);
			lookupOfLookups.set(shapeTransformedName, lookup);
		}

		if (sphereName != null)
		{
			lookup = new Map<string, any>
			([
				[ boxName, this.doesSphereContainBox ],
				[ mapLocatedName, this.doesSphereContainMapLocated ],
				[ meshName, this.doesSphereContainMesh ],
				[ shapeGroupAllName, this.doesShapeContainShapeGroupAll ],
				[ shapeGroupAnyName, this.doesShapeContainShapeGroupAny ],
				[ shapeInverseName, this.doesShapeContainShapeInverse ],
				[ shapeTransformedName, this.doesShapeContainShapeTransformed ],
				[ sphereName, this.doesSphereContainSphere ]
			]);
			lookupOfLookups.set(sphereName, lookup);
		}

		return lookupOfLookups;
	}

	// instance methods

	collisionActiveClosest(collisionsToCheck: Collision[]): Collision
	{
		var returnValue = collisionsToCheck.filter
		(
			x => x.isActive
		).sort
		(
			(x: Collision, y: Collision) => x.distanceToCollision - y.distanceToCollision
		)[0];

		return returnValue;
	}

	collisionOfEntities
	(
		entityColliding: Entity,
		entityCollidedWith: Entity,
		collisionOut: Collision
	): Collision
	{
		var collider0 = Collidable.of(entityColliding).collider;
		var collider1 = Collidable.of(entityCollidedWith).collider;

		collisionOut = this.collisionOfColliders(collider0, collider1, collisionOut);

		collisionOut.entityCollidingAdd(entityColliding);
		collisionOut.entityCollidingAdd(entityCollidedWith);

		return collisionOut;
	}

	collisionOfColliders
	(
		collider0: Shape, collider1: Shape, collisionOut: Collision
	): Collision
	{
		collisionOut.clear();

		// Prevents having to add some composite shapes, for example, Shell.
		while (collider0.collider() != null)
		{
			collider0 = collider0.collider();
		}

		while (collider1.collider() != null)
		{
			collider1 = collider1.collider();
		}

		var collider0TypeName = collider0.constructor.name;
		var collider1TypeName = collider1.constructor.name;

		var lookup = this.collisionFindByColliderTypeNameByColliderTypeName;

		var collidersCanBeCollided =
			lookup.has(collider0TypeName)
			&& lookup.has(collider1TypeName);

		if (collidersCanBeCollided == false)
		{
			this.throwOrLogErrorForColliderTypeNames(collider0TypeName, collider1TypeName);
		}
		else
		{
			var collisionMethod =
				lookup
					.get(collider0TypeName)
					.get(collider1TypeName);

			collisionMethod.call
			(
				this, collider0, collider1, collisionOut, true // shouldCalculatePos
			);
		}

		return collisionOut;
	}

	collisionsOfEntitiesCollidableInSets
	(
		entitiesCollidable0: Entity[], entitiesCollidable1: Entity[]
	): Collision[]
	{
		var returnValues = [];

		for (var i = 0; i < entitiesCollidable0.length; i++)
		{
			var entity0 = entitiesCollidable0[i];

			for (var j = 0; j < entitiesCollidable1.length; j++)
			{
				var entity1 = entitiesCollidable1[j];

				var doCollide = this.doEntitiesCollide(entity0, entity1);

				if (doCollide)
				{
					var collision = Collision.create();
					collision.entityCollidingAdd(entity0);
					collision.entityCollidingAdd(entity1);
					returnValues.push(collision);
				}
			}
		}

		return returnValues;
	}

	doEntitiesCollide(entity0: Entity, entity1: Entity): boolean
	{
		var doCollidersCollide = false;

		var collidable0 = Collidable.of(entity0);
		var collidable1 = Collidable.of(entity1);

		var collider0 = collidable0.collider;
		var collider1 = collidable1.collider;

		doCollidersCollide = this.doCollidersCollide(collider0, collider1);

		return doCollidersCollide;
	}

	doCollidersCollide(collider0: Shape, collider1: Shape): boolean
	{
		var returnValue = false;

		while (collider0.collider() != null)
		{
			collider0 = collider0.collider();
		}

		while (collider1.collider() != null)
		{
			collider1 = collider1.collider();
		}

		var collider0TypeName = collider0.constructor.name;
		var collider1TypeName = collider1.constructor.name;

		var lookup = this.doCollideByColliderTypeNameByColliderTypeName;

		var collidersCanBeCollided =
			lookup.has(collider0TypeName)
			&& lookup.has(collider1TypeName);

		if (collidersCanBeCollided == false)
		{
			this.throwOrLogErrorForColliderTypeNames(collider0TypeName, collider1TypeName);
		}
		else
		{
			var collisionMethod =
				lookup
					.get(collider0TypeName)
					.get(collider1TypeName);

			returnValue = collisionMethod.call
			(
				this, collider0, collider1
			);
		}

		return returnValue;
	}

	doesColliderContainOther(collider0: Shape, collider1: Shape): boolean
	{
		var returnValue = false;

		while (collider0.collider() != null)
		{
			collider0 = collider0.collider();
		}

		while (collider1.collider() != null)
		{
			collider1 = collider1.collider();
		}

		var collider0TypeName = collider0.constructor.name;
		var collider1TypeName = collider1.constructor.name;

		var lookup = this.doesContainByColliderTypeNameByColliderTypeName;

		var collidersCanBeCollided =
			lookup.has(collider0TypeName)
			&& lookup.has(collider1TypeName);

		if (collidersCanBeCollided == false)
		{
			this.throwOrLogErrorForColliderTypeNames(collider0TypeName, collider1TypeName);
		}
		else
		{
			var doesColliderContainOther =
				lookup
					.get(collider0TypeName)
					.get(collider1TypeName);

			returnValue = doesColliderContainOther.call
			(
				this, collider0, collider1
			);
		}

		return returnValue;
	}

	// shapes

	// collideEntitiesXAndY

	collideEntitiesBackUp(entity0: Entity, entity1: Entity): void
	{
		var collidable0 = Collidable.of(entity0);
		var collidable1 = Collidable.of(entity1);

		var entity0Loc = Locatable.of(entity0).loc;
		var entity1Loc = Locatable.of(entity1).loc;

		var pos0 = entity0Loc.pos;
		var pos1 = entity1Loc.pos;

		var vel0 = entity0Loc.vel;
		var vel1 = entity1Loc.vel;

		var speed0 = vel0.magnitude();
		var speed1 = vel1.magnitude();
		var speedMax = Math.max(speed0, speed1);

		var vel0InvertedNormalized =
			this._vel.overwriteWith(vel0).invert().normalize();
		var vel1InvertedNormalized =
			this._vel2.overwriteWith(vel1).invert().normalize();

		var distanceBackedUpSoFar = 0;

		while
		(
			this.doEntitiesCollide(entity0, entity1)
			&& distanceBackedUpSoFar < speedMax
		)
		{
			distanceBackedUpSoFar++;

			pos0.add(vel0InvertedNormalized);
			pos1.add(vel1InvertedNormalized);

			collidable0.colliderLocateForEntity(entity0);
			collidable1.colliderLocateForEntity(entity1);
		}
	}

	collideEntitiesBackUpDistance
	(
		entity0: Entity, entity1: Entity, distanceToBackUp: number
	): void
	{
		var collidable0 = Collidable.of(entity0);
		var collidable1 = Collidable.of(entity1);

		var entity0Loc = Locatable.of(entity0).loc;
		var entity1Loc = Locatable.of(entity1).loc;

		var pos0 = entity0Loc.pos;
		var pos1 = entity1Loc.pos;

		var vel0 = entity0Loc.vel;
		var vel1 = entity1Loc.vel;

		var displacement0 =
			this._vel
				.overwriteWith(vel0)
				.invert()
				.normalize()
				.multiplyScalar(distanceToBackUp);

		var displacement1 =
			this._vel2
				.overwriteWith(vel1)
				.invert()
				.normalize()
				.multiplyScalar(distanceToBackUp);

		pos0.add(displacement0);
		pos1.add(displacement1);

		collidable0.colliderLocateForEntity(entity0);
		collidable1.colliderLocateForEntity(entity1);
	}

	collideEntitiesBlock(entity0: Entity, entity1: Entity): void
	{
		// todo - Needs separation as well.
		this.collideEntitiesBlockOrBounce(entity0, entity1, 0); // coefficientOfRestitution
	}

	collideEntitiesBounce(entity0: Entity, entity1: Entity): void
	{
		this.collideEntitiesBlockOrBounce(entity0, entity1, 1); // coefficientOfRestitution
	}

	collideEntitiesBlockOrBounce(entity0: Entity, entity1: Entity, coefficientOfRestitution: number): void
	{
		var collisionPos = this.collisionOfEntities
		(
			entity0, entity1, this._collision
		).pos;

		var collidable0 = Collidable.of(entity0);
		var collidable1 = Collidable.of(entity1);

		var collider0 = collidable0.collider;
		var collider1 = collidable1.collider;

		var normal0 = collider0.normalAtPos
		(
			collisionPos, Coords.create() // normalOut
		);
		var normal1 = collider1.normalAtPos
		(
			collisionPos, Coords.create() // normalOut
		);

		var entity0Loc = Locatable.of(entity0).loc;
		var entity1Loc = Locatable.of(entity1).loc;

		var vel0 = entity0Loc.vel;
		var vel1 = entity1Loc.vel;

		var vel0DotNormal1 = vel0.dotProduct(normal1);
		var vel1DotNormal0 = vel1.dotProduct(normal0);

		var multiplierOfRestitution = 1 + coefficientOfRestitution;

		if (vel0DotNormal1 < 0)
		{
			var vel0Bounce = normal1.multiplyScalar
			(
				0 - vel0DotNormal1
			).multiplyScalar
			(
				multiplierOfRestitution
			);

			vel0.add(vel0Bounce);
			entity0Loc.orientation.forwardSet
			(
				this._vel.overwriteWith(vel0).normalize()
			);
		}

		if (vel1DotNormal0 < 0)
		{
			var vel1Bounce = normal0.multiplyScalar
			(
				0 - vel1DotNormal0
			).multiplyScalar
			(
				multiplierOfRestitution
			);
			vel1.add(vel1Bounce);
			entity1Loc.orientation.forwardSet
			(
				this._vel.overwriteWith(vel1).normalize()
			);
		}
	}

	collideEntitiesSeparate(entity0: Entity, entity1: Entity): void
	{
		var entity0Loc = Locatable.of(entity0).loc;
		var entity0Pos = entity0Loc.pos;
		var collidable1 = Collidable.of(entity1);
		var collider1 = collidable1.collider;

		var collider1Normal = collider1.normalAtPos
		(
			entity0Pos, Coords.create() // normalOut
		);

		var distanceMovedSoFar = 0;
		var distanceToMoveMax = 10;

		while (this.doEntitiesCollide(entity0, entity1) && distanceMovedSoFar < distanceToMoveMax)
		{
			distanceMovedSoFar++;
			entity0Pos.add(collider1Normal);

			var collidable0 = Collidable.of(entity0);
			collidable0.colliderLocateForEntity(entity0);
		}
	}

	// collisionOfXAndY

	collisionOfBoxAndBox(box1: BoxAxisAligned, box2: BoxAxisAligned, collision: Collision): Collision
	{
		if (collision == null)
		{
			collision = Collision.create();
		}

		var boxOfIntersection = box1.intersectWith(box2);
		if (boxOfIntersection != null)
		{
			collision.isActive = true;
			collision.pos.overwriteWith(boxOfIntersection.center)
		}

		return collision;
	}

	collisionOfBoxAndMapLocated(box: BoxAxisAligned, mapLocated: MapLocated, collision: Collision): Collision
	{
		var doBoundsCollide =
			this.doBoxAndBoxCollide(mapLocated.box, box);

		if (doBoundsCollide == false)
		{
			return collision;
		}

		var map = mapLocated.map;
		var cell = map.cellCreate();
		var cellPosAbsolute = Coords.create();
		var cellPosInCells = Coords.create();
		var mapSizeInCells = map.sizeInCells;
		var mapCellSize = map.cellSize;
		var mapSizeHalf = map.sizeHalf;
		var mapPos = mapLocated.loc.pos;
		var cellAsBox = BoxAxisAligned.fromSize(map.cellSize);

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;
			cellPosAbsolute.y = (y * mapCellSize.y) + mapPos.y - mapSizeHalf.y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;
				cellPosAbsolute.x = (x * mapCellSize.x) + mapPos.x - mapSizeHalf.x;

				cell = map.cellAtPosInCells(cellPosInCells) as any;

				if (cell.isBlocking)
				{
					cellAsBox.center.overwriteWith(cellPosAbsolute);
					var doCellAndBoxCollide = this.doBoxAndBoxCollide(cellAsBox, box);
					if (doCellAndBoxCollide)
					{
						collision.isActive = true;
						collision.pos.overwriteWith(cellAsBox.center);
						break;
					}
				}
			}
		}

		return collision;
	}

	collisionOfBoxAndMesh(box: BoxAxisAligned, mesh: Mesh, collision: Collision): Collision
	{
		if (collision == null)
		{
			collision = Collision.create();
		}

		// hack
		var meshBoundsAsBox = mesh.box();

		var boxOfIntersection = box.intersectWith(meshBoundsAsBox);
		if (boxOfIntersection != null)
		{
			collision.isActive = true;
			collision.pos.overwriteWith(boxOfIntersection.center)
		}

		return collision;
	}

	collisionOfBoxAndSphere
	(
		box: BoxAxisAligned, sphere: Sphere, collision: Collision, shouldCalculatePos: boolean
	): Collision
	{
		var doCollide = false;

		var displacementBetweenCenters =
			this._displacement
				.overwriteWith(sphere.center)
				.subtract(box.center);

		var displacementBetweenCentersAbsolute =
			displacementBetweenCenters.absolute();

		var boxSizeHalf = box.sizeHalf();
		var sphereRadius = sphere.radius();

		var doExtentsCollide =
		(
			displacementBetweenCentersAbsolute.x <= boxSizeHalf.x + sphereRadius
			&& displacementBetweenCentersAbsolute.y <= boxSizeHalf.y + sphereRadius
			&& displacementBetweenCentersAbsolute.z <= boxSizeHalf.z + sphereRadius
		);

		if (doExtentsCollide)
		{
			var isSphereNotAtCorner =
			(
				displacementBetweenCentersAbsolute.x < boxSizeHalf.x
				|| displacementBetweenCentersAbsolute.y < boxSizeHalf.y
				|| displacementBetweenCentersAbsolute.z < boxSizeHalf.z
			);

			if (isSphereNotAtCorner)
			{
				doCollide = true;
			}
			else
			{
				var distanceBetweenCenters =
					displacementBetweenCentersAbsolute.magnitude();
				var boxDiagonal = boxSizeHalf.magnitude();

				var doesSphereContainCornerOfBox =
				(
					distanceBetweenCenters < (boxDiagonal + sphereRadius)
				);

				doCollide = doesSphereContainCornerOfBox;
			}
		}

		if (collision == null)
		{
			collision = Collision.create();
		}

		collision.isActive = doCollide;

		if (doCollide && shouldCalculatePos)
		{
			// todo - Fix this.
			var boxCircumscribedAroundSphere =
				BoxAxisAligned.fromCenterAndSize
				(
					sphere.center,
					Coords.ones().multiplyScalar(sphereRadius * 2)
				);
			collision = this.collisionOfBoxAndBox(box, boxCircumscribedAroundSphere, collision);
		}

		return collision;
	}

	collisionOfEdgeAndEdge(edge0: Edge, edge1: Edge, collision: Collision): Collision
	{
		// 2D

		if (collision == null)
		{
			collision = Collision.create();
		}
		collision.clear();

		var edge0Bounds = edge0.toBoxAxisAligned(this._box);
		var edge1Bounds = edge1.toBoxAxisAligned(this._box2);

		var doBoundsOverlap = edge0Bounds.overlapsWithXY(edge1Bounds);

		if (doBoundsOverlap)
		{
			var edge0ProjectedOntoEdge1 = this._edge.overwriteWith(
				edge0
			).projectOntoOther(edge1);

			var edgeProjectedVertices = edge0ProjectedOntoEdge1.vertices;
			var edgeProjectedVertex0 = edgeProjectedVertices[0];
			var edgeProjectedVertex1 = edgeProjectedVertices[1];

			var doesEdgeCrossLineOfOther =
				(edgeProjectedVertex0.y > 0 && edgeProjectedVertex1.y <= 0)
				|| (edgeProjectedVertex0.y <= 0 && edgeProjectedVertex1.y > 0);

			if (doesEdgeCrossLineOfOther)
			{
				var edgeProjectedDirection = edge0ProjectedOntoEdge1.direction();

				var distanceAlongEdge0ToLineOfEdge1 =
					0
					- edgeProjectedVertex0.y
					/ edgeProjectedDirection.y;

				var distanceAlongEdge1ToEdge0 =
					edgeProjectedVertex0.x + edgeProjectedDirection.x * distanceAlongEdge0ToLineOfEdge1;

				var doesEdgeCrossOtherWithinItsExtent =
				(
					distanceAlongEdge1ToEdge0 >= 0
					&& distanceAlongEdge1ToEdge0 <= edge1.length()
				);

				if (doesEdgeCrossOtherWithinItsExtent)
				{
					collision.isActive = true;
					collision.distanceToCollision = distanceAlongEdge0ToLineOfEdge1;
					collision.pos.overwriteWith
					(
						edge0.direction()
					).multiplyScalar
					(
						distanceAlongEdge0ToLineOfEdge1
					).add
					(
						edge0.vertices[0]
					);
					collision.colliders.push(edge1);
					collision.collidersByName.set(Edge.name, edge1);
				}

			} // end if (doesEdgeCrossLineOfOther)

		} // end if (doBoundsOverlap)

		return collision;
	}

	collisionOfEdgeAndFace(edge: Edge, face: Face, collision: Collision): Collision
	{
		var facePlane = face.plane();

		collision = this.collisionOfEdgeAndPlane
		(
			edge, facePlane, collision
		);

		if (collision.isActive)
		{
			var isWithinFace = face.containsPoint
			(
				collision.pos
			);

			collision.isActive = isWithinFace;

			if (isWithinFace)
			{
				collision.colliders.push(face);
				collision.collidersByName.set(Face.name, face);
			}
		}

		return collision;
	}

	collisionsOfEdgeAndMesh
	(
		edge: Edge, mesh: Mesh, collisions: Collision[], stopAfterFirst: boolean
	): Collision[]
	{
		if (collisions == null)
		{
			collisions = [];
		}

		var meshFaces = mesh.faces();
		for (var i = 0; i < meshFaces.length; i++)
		{
			var meshFace = meshFaces[i];
			var collision = this.collisionOfEdgeAndFace
			(
				edge, meshFace, Collision.create()
			);
			if (collision.isActive)
			{
				collision.colliders.push(mesh);
				collision.collidersByName.set(Mesh.name, mesh);
				collisions.push(collision);
				if (stopAfterFirst)
				{
					break;
				}
			}
		}

		return collisions;
	}

	collisionOfEdgeAndPlane(edge: Edge, plane: Plane, collision: Collision): Collision
	{
		if (collision == null)
		{
			collision = Collision.create();
		}

		var returnValue = collision;

		var edgeVertex0 = edge.vertices[0];
		var edgeDirection = edge.direction();

		var planeNormal = plane.normal;

		var edgeDirectionDotPlaneNormal = edgeDirection.dotProduct(planeNormal);
		var doesEdgeGoTowardPlane = (edgeDirectionDotPlaneNormal < 0);

		if (doesEdgeGoTowardPlane)
		{
			var distanceToCollision =
				(
					plane.distanceFromOrigin
					- planeNormal.dotProduct(edgeVertex0)
				)
				/ planeNormal.dotProduct(edgeDirection);

			var edgeLength = edge.length();

			if (distanceToCollision >= 0 && distanceToCollision <= edgeLength)
			{
				collision.isActive = true;

				collision.pos.overwriteWith
				(
					edgeDirection
				).multiplyScalar
				(
					distanceToCollision
				).add
				(
					edge.vertices[0]
				);

				collision.distanceToCollision = distanceToCollision;

				var colliders = returnValue.colliders;
				var collidersByName = returnValue.collidersByName;

				colliders.length = 0;
				collidersByName.clear();

				colliders.push(edge);
				collidersByName.set(Edge.name, edge);
				colliders.push(plane);
				collidersByName.set(Plane.name, plane);
			}
		}

		return returnValue;
	}

	collisionOfHemispaceAndBox(hemispace: Hemispace, box: BoxAxisAligned, collision: Collision): Collision
	{
		if (collision == null)
		{
			collision = Collision.create();
		}

		var plane = hemispace.plane;
		var boxVertices = box.vertices();
		for (var i = 0; i < boxVertices.length; i++)
		{
			var vertex = boxVertices[i];
			var distanceOfVertexFromOriginAlongNormal =
				vertex.dotProduct(plane.normal);
			var distanceOfVertexAbovePlane =
				distanceOfVertexFromOriginAlongNormal
				- plane.distanceFromOrigin;
			if (distanceOfVertexAbovePlane < 0)
			{
				collision.isActive = true;
				plane.pointClosestToOrigin(collision.pos);
				collision.colliders.length = 0;
				collision.colliders.push(hemispace);
				break;
			}
		}

		return collision;
	}

	collisionOfHemispaceAndSphere
	(
		hemispace: Hemispace, sphere: Sphere, collision: Collision
	): Collision
	{
		if (collision == null)
		{
			collision = Collision.create();
		}

		var plane = hemispace.plane;
		var distanceOfSphereCenterFromOriginAlongNormal =
			sphere.center.dotProduct(plane.normal);
		var distanceOfSphereCenterAbovePlane =
			distanceOfSphereCenterFromOriginAlongNormal
			- plane.distanceFromOrigin;
		if (distanceOfSphereCenterAbovePlane < sphere.radius() )
		{
			collision.isActive = true;
			plane.pointClosestToOrigin(collision.pos);
			collision.colliders.length = 0;
			collision.colliders.push(hemispace);
		}
		return collision;
	}

	collisionOfMapLocatedAndBox
	(
		mapLocated: MapLocated, box: BoxAxisAligned, collision: Collision
	): Collision
	{
		return this.collisionOfBoxAndMapLocated(box, mapLocated, collision);
	}

	collisionOfMapLocatedAndMapLocated
	(
		mapLocated0: MapLocated, mapLocated1: MapLocated, collision: Collision
	): Collision
	{
		return collision; // todo
	}

	collisionOfMapLocatedAndSphere
	(
		mapLocated: MapLocated, sphere: Sphere, collision: Collision
	): Collision
	{
		var doBoundsCollide =
			this.doBoxAndSphereCollide(mapLocated.box, sphere);

		if (doBoundsCollide == false)
		{
			return collision;
		}

		var map = mapLocated.map;
		var cell = map.cellCreate();
		var cellPosAbsolute = Coords.create();
		var cellPosInCells = Coords.create();
		var mapSizeInCells = map.sizeInCells;
		var mapCellSize = map.cellSize;
		var mapSizeHalf = map.sizeHalf;
		var mapPos = mapLocated.loc.pos;
		var cellAsBox = BoxAxisAligned.fromSize(map.cellSize);

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;
			cellPosAbsolute.y = (y * mapCellSize.y) + mapPos.y - mapSizeHalf.y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;
				cellPosAbsolute.x = (x * mapCellSize.x) + mapPos.x - mapSizeHalf.x;

				cell = map.cellAtPosInCells(cellPosInCells) as any;

				if (cell.isBlocking)
				{
					cellAsBox.center.overwriteWith(cellPosAbsolute);
					var doCellAndSphereCollide = this.doBoxAndSphereCollide(cellAsBox, sphere);
					if (doCellAndSphereCollide)
					{
						collision.isActive = true;
						collision.pos.overwriteWith(cellAsBox.center);
						break;
					}
				}
			}
		}

		return collision;
	}

	collisionOfMeshAndBox(mesh: Mesh, box: BoxAxisAligned, collision: Collision): Collision
	{
		return this.collisionOfBoxAndMesh(box, mesh, collision);
	}

	collisionOfMeshAndSphere(mesh: Mesh, sphere: Sphere, collision: Collision): Collision
	{
		// hack
		var meshBoundsAsBox = mesh.box();
		return this.collisionOfBoxAndSphere(meshBoundsAsBox, sphere, collision, true); // shouldCalculatePos
	}

	collisionOfPointAndPoint(point0: Point, point1: Point, collisionOut: Collision): Collision
	{
		collisionOut.pos.overwriteWith
		(
			point0.pos
		);

		return collisionOut;
	}

	collisionOfShapeAndShapeGroupAll
	(
		shape: Shape,
		shapeGroupAll: ShapeGroupAll,
		collisionOut: Collision
	): Collision
	{
		return this.collisionOfColliders
		(
			shape,
			shapeGroupAll.children[0], // Seems wrong.
			collisionOut
		);
	}

	collisionOfShapeAndShapeGroupAny
	(
		shape: Shape,
		shapeGroupAny: ShapeGroupAny,
		collisionOut: Collision
	): Collision
	{
		var shapesAny = shapeGroupAny.children;
		for (var i = 0; i < shapesAny.length; i++)
		{
			var shapeAny = shapesAny[i];

			collisionOut = this.collisionOfColliders
			(
				shape, shapeAny, collisionOut
			);

			if (collisionOut.isActive)
			{
				break;
			}
		}

		return collisionOut;
	}

	collisionOfShapeAndShapeInverse(shape: Shape, shapeInverse: ShapeInverse, collisionOut: Collision): Collision
	{
		return collisionOut; // todo
	}

	collisionOfShapeAndShapeTransformed
	(
		shape: Shape,
		shapeTransformed: ShapeTransformed, 
		collisionOut: Collision
	): Collision
	{
		var shapeTransformedChild = shapeTransformed.child;
		// todo - Apply transform here?
		collisionOut = this.collisionOfColliders(shape, shapeTransformedChild, collisionOut);
		return collisionOut;
	}

	collisionOfShapeGroupAllAndShape
	(
		shapeGroupAll: ShapeGroupAll, shape: Shape, collisionOut: Collision
	): Collision
	{
		return this.collisionOfShapeAndShapeGroupAll(shape, shapeGroupAll, collisionOut);
	}

	collisionOfShapeGroupAnyAndShape
	(
		shapeGroupAny: ShapeGroupAny, shape: Shape, collisionOut: Collision
	): Collision
	{
		return this.collisionOfShapeAndShapeGroupAny(shape, shapeGroupAny, collisionOut);
	}

	collisionOfShapeInverseAndShape
	(
		shapeInverse: ShapeInverse, shape: Shape, collisionOut: Collision
	): Collision
	{
		return this.collisionOfShapeAndShapeInverse(shape, shapeInverse, collisionOut);
	}

	collisionOfShapeTransformedAndShape
	(
		shapeTransformed: ShapeTransformed, shape: Shape, collisionOut: Collision
	): Collision
	{
		return this.collisionOfShapeAndShapeTransformed(shape, shapeTransformed, collisionOut);
	}

	collisionOfSphereAndBox(sphere: Sphere, box: BoxAxisAligned, collision: Collision, shouldCalculatePos: boolean): Collision
	{
		return this.collisionOfBoxAndSphere(box, sphere, collision, shouldCalculatePos);
	}

	collisionOfSphereAndMapLocated(sphere: Sphere, mapLocated: MapLocated, collision: Collision): Collision
	{
		return this.collisionOfMapLocatedAndSphere(mapLocated, sphere, collision);
	}

	collisionOfSphereAndMesh(sphere: Sphere, mesh: Mesh, collision: Collision): Collision
	{
		return this.collisionOfMeshAndSphere(mesh, sphere, collision);
	}

	collisionOfSpheres(sphere0: Sphere, sphere1: Sphere, collision: Collision): Collision
	{
		var sphere0Center = sphere0.center;
		var sphere1Center = sphere1.center;

		var sphere0Radius = sphere0.radius();
		var sphere1Radius = sphere1.radius();

		var displacementFromSphere0CenterTo1 =
			this._displacement
				.overwriteWith(sphere1Center)
				.subtract(sphere0Center);

		var distanceBetweenCenters =
			displacementFromSphere0CenterTo1.magnitude();

		if (distanceBetweenCenters == 0)
		{
			collision.pos.overwriteWith(sphere0Center);
		}
		else
		{
			var distanceToRadicalCenter =
			(
				distanceBetweenCenters * distanceBetweenCenters
				+ sphere0Radius * sphere0Radius
				- sphere1Radius * sphere1Radius
			)
			/ (2 * distanceBetweenCenters);

			var directionFromSphere0CenterTo1 =
				displacementFromSphere0CenterTo1.divideScalar(distanceBetweenCenters);
			var displacementFromSphereCenter0ToRadicalCenter =
				directionFromSphere0CenterTo1.multiplyScalar(distanceToRadicalCenter);

			collision.pos.overwriteWith
			(
				displacementFromSphereCenter0ToRadicalCenter
			).add
			(
				sphere0Center
			);
		}

		return collision;
	}

	// doXAndYCollide

	doBoxAndBoxCollide(box0: BoxAxisAligned, box1: BoxAxisAligned): boolean
	{
		var returnValue = box0.overlapsWith(box1);
		return returnValue;
	}

	doBoxAndCylinderCollide(box: BoxAxisAligned, cylinder: Cylinder): boolean
	{
		var returnValue = false;

		var displacementBetweenCenters = this._displacement.overwriteWith
		(
			box.center
		).subtract
		(
			cylinder.center
		);

		if (displacementBetweenCenters.z < box.sizeHalf().z + cylinder.lengthHalf)
		{
			displacementBetweenCenters.clearZ();

			var direction = displacementBetweenCenters.normalize();

			var pointOnCylinderClosestToBoxCenter = direction.multiplyScalar
			(
				cylinder.radius
			).add
			(
				cylinder.center
			);

			pointOnCylinderClosestToBoxCenter.z = box.center.z;

			var isPointOnCylinderWithinBox = box.containsPoint
			(
				pointOnCylinderClosestToBoxCenter
			);

			returnValue = isPointOnCylinderWithinBox;
		}

		return returnValue;
	}

	doBoxAndHemispaceCollide(box: BoxAxisAligned, hemispace: Hemispace): boolean
	{
		var returnValue = false;

		var vertices = Mesh.fromBox(box).vertices();
		for (var i = 0; i < vertices.length; i++)
		{
			var vertex = vertices[i];
			if (hemispace.containsPoint(vertex))
			{
				returnValue = true;
				break;
			}
		}
		return returnValue;
	}

	doBoxAndMapLocatedCollide(box: BoxAxisAligned, mapLocated: MapLocated): boolean
	{
		return this.doBoxAndBoxCollide(box, mapLocated.box);
	}

	doBoxAndMapLocated2Collide(box: BoxAxisAligned, mapLocated: MapLocated2): boolean
	{
		var doCollide = this.doBoxAndBoxCollide(box, mapLocated.box);
		if (doCollide)
		{
			doCollide = false;

			var cellsInBox = mapLocated.cellsInBox
			(
				box, ArrayHelper.clear(this._mapCells)
			);
			var areAnyCellsInBoxBlocking = cellsInBox.some
			(
				x => (x as MapCellCollidable).isBlocking
			);
			doCollide = areAnyCellsInBoxBlocking;
		}

		return doCollide;
	}

	doBoxAndMeshCollide(box: BoxAxisAligned, mesh: Mesh): boolean
	{
		// todo
		return this.doBoxAndBoxCollide(box, mesh.box() );
	}

	doBoxAndShapeContainerCollide(box: BoxAxisAligned, shapeContainer: ShapeContainer): boolean
	{
		return this.doShapeContainerAndShapeCollide(shapeContainer, box);
	}

	doBoxAndShapeGroupAllCollide(box: BoxAxisAligned, shapeGroupAll: ShapeGroupAll): boolean
	{
		return this.doShapeGroupAllAndShapeCollide(shapeGroupAll, box);
	}

	doBoxAndShapeGroupAnyCollide(box: BoxAxisAligned, group: ShapeGroupAny): boolean
	{
		return this.doShapeGroupAnyAndShapeCollide(group, box);
	}

	doBoxAndShapeInverseCollide(box: BoxAxisAligned, shapeInverse: ShapeInverse): boolean
	{
		return this.doShapeInverseAndShapeCollide(shapeInverse, box);
	}

	doBoxAndShapeTransformedCollide(box: BoxAxisAligned, shapeTransformed: ShapeTransformed): boolean
	{
		return this.doShapeTransformedAndShapeCollide(shapeTransformed, box);
	}

	doBoxAndSphereCollide(box: BoxAxisAligned, sphere: Sphere): boolean
	{
		return this.collisionOfBoxAndSphere(box, sphere, this._collision, false).isActive;
	}

	doCylinderAndCylinderCollide(cylinder0: Cylinder, cylinder1: Cylinder): boolean
	{
		var returnValue = false;

		var displacement = this._displacement.overwriteWith
		(
			cylinder1.center
		).subtract
		(
			cylinder0.center
		).clearZ();

		var distance = displacement.magnitude();
		var sumOfRadii = cylinder0.radius + cylinder1.radius;
		var doRadiiOverlap = (distance < sumOfRadii);
		if (doRadiiOverlap)
		{
			var doLengthsOverlap = false; // todo
			/*
			(
				(
					cylinder0.zMin > cylinder1.zMin
					&& cylinder0.zMin < cylinder1.zMax
				)
				||
				(
					cylinder0.zMax > cylinder1.zMin
					&& cylinder0.zMax < cylinder1.zMax
				)
				||
				(
					cylinder1.zMin > cylinder0.zMin
					&& cylinder1.zMin < cylinder0.zMax
				)
				||
				(
					cylinder1.zMax > cylinder0.zMin
					&& cylinder1.zMax < cylinder0.zMax
				)
			);
			*/

			if (doLengthsOverlap)
			{
				returnValue = true;
			}
		}

		return returnValue;
	}

	doEdgeAndFaceCollide(edge: Edge, face: Face, collision: Collision): boolean
	{
		return (this.collisionOfEdgeAndFace(edge, face, collision).isActive);
	}

	doEdgeAndHemispaceCollide(edge: Edge, hemispace: Hemispace): boolean
	{
		var vertices = edge.vertices;
		var returnValue = ( hemispace.containsPoint(vertices[0]) || hemispace.containsPoint(vertices[1]) );
		return returnValue;
	}

	doEdgeAndMeshCollide(edge: Edge, mesh: Mesh): boolean
	{
		var returnValue = false;

		var edgeDirection = edge.direction();
		var meshFaces = mesh.faces();
		for (var f = 0; f < meshFaces.length; f++)
		{
			var face = meshFaces[f];
			var facePlane = face.plane();
			var faceNormal = facePlane.normal;
			var faceDotEdge = faceNormal.dotProduct(edgeDirection);

			if (faceDotEdge < 0)
			{
				returnValue = this.doEdgeAndFaceCollide(edge, face, this._collision);
				if (returnValue == true)
				{
					break;
				}
			}
		}

		return returnValue;
	}

	doEdgeAndPlaneCollide(edge: Edge, plane: Plane): boolean
	{
		return (this.collisionOfEdgeAndPlane(edge, plane, this._collision.clear()) != null);
	}

	doHemispaceAndBoxCollide(hemispace: Hemispace, box: BoxAxisAligned): boolean
	{
		var collision = this.collisionOfHemispaceAndBox(hemispace, box, this._collision.clear());

		return collision.isActive;
	}

	doHemispaceAndSphereCollide(hemispace: Hemispace, sphere: Sphere): boolean
	{
		var collision = this.collisionOfHemispaceAndSphere(hemispace, sphere, this._collision.clear());

		return collision.isActive;
	}

	doMeshAndBoxCollide(mesh: Mesh, box: BoxAxisAligned): boolean
	{
		return this.doBoxAndMeshCollide(box, mesh);
	}

	doMeshAndMeshCollide(mesh0: Mesh, mesh1: Mesh): boolean
	{
		var returnValue = true;

		// hack - Meshes are assumed to be convex.

		var meshVertices: Coords[][] = [ mesh0.vertices(), mesh1.vertices() ];
		var meshFaces: Face[][] = [ mesh0.faces(), mesh1.faces() ];

		for (var m = 0; m < 2; m++)
		{
			var meshThisFaces = meshFaces[m];
			var meshThisVertices = meshVertices[m];
			var meshOtherVertices = meshVertices[1 - m];

			for (var f = 0; f < meshThisFaces.length; f++)
			{
				var face = meshThisFaces[f];
				var faceNormal = face.plane().normal;

				var vertexThis = meshThisVertices[0];
				var vertexThisProjectedMin = vertexThis.dotProduct(faceNormal);
				var vertexThisProjectedMax = vertexThisProjectedMin;
				for (var v = 1; v < meshThisVertices.length; v++)
				{
					vertexThis = meshThisVertices[v];
					var vertexThisProjected = vertexThis.dotProduct(faceNormal);
					if (vertexThisProjected < vertexThisProjectedMin)
					{
						vertexThisProjectedMin = vertexThisProjected;
					}

					if (vertexThisProjected > vertexThisProjectedMax)
					{
						vertexThisProjectedMax = vertexThisProjected;
					}
				}

				var vertexOther = meshOtherVertices[0];
				var vertexOtherProjectedMin = vertexOther.dotProduct(faceNormal);
				var vertexOtherProjectedMax = vertexOtherProjectedMin;
				for (var v = 1; v < meshOtherVertices.length; v++)
				{
					vertexOther = meshOtherVertices[v];
					var vertexOtherProjected = vertexOther.dotProduct(faceNormal);
					if (vertexOtherProjected < vertexOtherProjectedMin)
					{
						vertexOtherProjectedMin = vertexOtherProjected;
					}

					if (vertexOtherProjected > vertexOtherProjectedMax)
					{
						vertexOtherProjectedMax = vertexOtherProjected;
					}
				}

				var doProjectionsOverlap =
				(
					vertexThisProjectedMax > vertexOtherProjectedMin
					&& vertexOtherProjectedMax > vertexThisProjectedMin
				);

				if (doProjectionsOverlap == false)
				{
					returnValue = false;
					break;
				}
			}
		}

		return returnValue;
	}

	doMeshAndShapeInverseCollide(mesh: Mesh, inverse: ShapeInverse): boolean
	{
		return this.doShapeInverseAndShapeCollide(inverse, mesh);
	}

	doMapLocatedAndBoxCollide(mapLocated: MapLocated, box: BoxAxisAligned): boolean
	{
		return this.doBoxAndMapLocatedCollide(box, mapLocated);
	}

	doMapLocated2AndBoxCollide(mapLocated: MapLocated2, box: BoxAxisAligned): boolean
	{
		return this.doBoxAndMapLocated2Collide(box, mapLocated);
	}

	doMapLocatedAndMapLocatedCollide(mapLocated0: MapLocated, mapLocated1: MapLocated): boolean
	{
		var returnValue = false;

		var doBoundsCollide =
			this.doBoxAndBoxCollide(mapLocated0.box, mapLocated1.box);

		if (doBoundsCollide == false)
		{
			return false;
		}

		var map0 = mapLocated0.map;
		var map1 = mapLocated1.map;

		var cell0 = map0.cellCreate() as any;
		var cell1 = map1.cellCreate() as any;

		var cell0PosAbsolute = Coords.create();

		var cell0PosInCells = Coords.create();
		var cell1PosInCells = Coords.create();

		var cell1PosInCellsMin = Coords.create();
		var cell1PosInCellsMax = Coords.create();

		var map0SizeInCells = map0.sizeInCells;

		var map1SizeInCellsMinusOnes = map1.sizeInCellsMinusOnes;

		var map0CellSize = map0.cellSize;
		var map1CellSize = map1.cellSize;

		var map0Pos = mapLocated0.loc.pos;
		var map1Pos = mapLocated1.loc.pos;

		for (var y0 = 0; y0 < map0SizeInCells.y; y0++)
		{
			cell0PosInCells.y = y0;
			cell0PosAbsolute.y = map0Pos.y + (y0 * map0CellSize.y);

			for (var x0 = 0; x0 < map0SizeInCells.x; x0++)
			{
				cell0PosInCells.x = x0;
				cell0PosAbsolute.x = map0Pos.x + (x0 * map0CellSize.x);

				cell0 = map0.cellAtPosInCells(cell0PosInCells) as any;

				if (cell0.isBlocking)
				{
					cell1PosInCellsMin.overwriteWith
					(
						cell0PosAbsolute
					).subtract
					(
						map1Pos
					).divide
					(
						map1CellSize
					).floor();

					cell1PosInCellsMax.overwriteWith
					(
						cell0PosAbsolute
					).subtract
					(
						map1Pos
					).add
					(
						map0CellSize
					).divide
					(
						map1CellSize
					).floor();

					for (var y1 = cell1PosInCellsMin.y; y1 <= cell1PosInCellsMax.y; y1++)
					{
						cell1PosInCells.y = y1;

						for (var x1 = cell1PosInCellsMin.x; x1 < cell1PosInCellsMax.x; x1++)
						{
							cell1PosInCells.x = x1;

							var isCell1PosInBox = cell1PosInCells.isInRangeMinMax
							(
								Coords.Instances().Zeroes, map1SizeInCellsMinusOnes
							);
							if (isCell1PosInBox)
							{
								cell1 = map1.cellAtPosInCells(cell1PosInCells) as any;

								if (cell1.isBlocking)
								{
									returnValue = true;

									y1 = cell1PosInCellsMax.y;
									x0 = map0SizeInCells.x;
									y0 = map0SizeInCells.y;
									break;
								}
							}
						}
					}
				}
			}
		}

		return returnValue;
	}

	doMapLocatedAndSphereCollide(mapLocated: MapLocated, sphere: Sphere): boolean
	{
		var returnValue = false;

		var doBoundsCollide =
			this.doBoxAndSphereCollide(mapLocated.box, sphere);

		if (doBoundsCollide == false)
		{
			return false;
		}

		var map = mapLocated.map;
		var cell = map.cellCreate();
		var cellPosAbsolute = Coords.create();
		var cellPosInCells = Coords.create();
		var mapSizeInCells = map.sizeInCells;
		var mapCellSize = map.cellSize;
		var mapSizeHalf = map.sizeHalf;
		var mapPos = mapLocated.loc.pos;
		var cellAsBox = BoxAxisAligned.fromSize(map.cellSize);

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;
			cellPosAbsolute.y = (y * mapCellSize.y) + mapPos.y - mapSizeHalf.y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;
				cellPosAbsolute.x = (x * mapCellSize.x) + mapPos.x - mapSizeHalf.x;

				cell = map.cellAtPosInCells(cellPosInCells) as any;

				if (cell.isBlocking)
				{
					cellAsBox.center.overwriteWith(cellPosAbsolute);
					var doCellAndSphereCollide = this.doBoxAndSphereCollide(cellAsBox, sphere);
					if (doCellAndSphereCollide)
					{
						returnValue = true;
						break;
					}
				}
			}
		}

		return returnValue;
	}

	doMeshAndSphereCollide(mesh: Mesh, sphere: Sphere): boolean
	{
		var returnValue = true;

		// hack - Mesh is assumed to be convex.

		var meshFaces = mesh.faces();
		var hemispace = new Hemispace(null);

		for (var f = 0; f < meshFaces.length; f++)
		{
			var face = meshFaces[f];
			hemispace.plane = face.plane();
			var doHemispaceAndSphereCollide = this.doHemispaceAndSphereCollide
			(
				hemispace,
				sphere
			);
			if (doHemispaceAndSphereCollide == false)
			{
				returnValue = false;
				break;
			}
		}

		return returnValue;
	}

	doPointAndPointCollide(point0: Point, point1: Point): boolean
	{
		return point0.pos.equals(point1.pos);
	}

	doShapeAndShapeGroupAllCollide(shape: Shape, shapeGroupAll: ShapeGroupAll): boolean
	{
		return this.doShapeGroupAllAndShapeCollide(shapeGroupAll, shape);
	}

	doShapeAndShapeGroupAnyCollide(shape: Shape, shapeGroupAny: ShapeGroupAny): boolean
	{
		return this.doShapeGroupAnyAndShapeCollide(shapeGroupAny, shape);
	}

	doShapeAndShapeInverseCollide(shape: Shape, shapeInverse: ShapeInverse): boolean
	{
		return this.doShapeInverseAndShapeCollide(shapeInverse, shape);
	}

	doShapeAndShapeTransformedCollide(shape: Shape, shapeTransformed: ShapeTransformed): boolean
	{
		return this.doShapeTransformedAndShapeCollide(shapeTransformed, shape);
	}

	doSphereAndBoxCollide(sphere: Sphere, box: BoxAxisAligned): boolean
	{
		return this.doBoxAndSphereCollide(box, sphere);
	}

	doSphereAndMapLocatedCollide(sphere: Sphere, mapLocated: MapLocated): boolean
	{
		return this.doMapLocatedAndSphereCollide(mapLocated, sphere);
	}

	doSphereAndMeshCollide(sphere: Sphere, mesh: Mesh): boolean
	{
		return this.doMeshAndSphereCollide(mesh, sphere);
	}

	doSphereAndShapeContainerCollide(sphere: Sphere, shapeContainer: ShapeContainer): boolean
	{
		return this.doShapeContainerAndShapeCollide(shapeContainer, sphere);
	}

	doSphereAndShapeGroupAllCollide(sphere: Sphere, shapeGroupAll: ShapeGroupAll): boolean
	{
		return this.doShapeGroupAllAndShapeCollide(shapeGroupAll, sphere);
	}

	doSphereAndShapeGroupAnyCollide(sphere: Sphere, shapeGroupAny: ShapeGroupAny): boolean
	{
		return this.doShapeGroupAnyAndShapeCollide(shapeGroupAny, sphere);
	}

	doSphereAndShapeInverseCollide(sphere: Sphere, shapeInverse: ShapeInverse): boolean
	{
		return this.doShapeInverseAndShapeCollide(shapeInverse, sphere);
	}

	doSphereAndShapeTransformedCollide(sphere: Sphere, shapeTransformed: ShapeTransformed): boolean
	{
		return this.doShapeTransformedAndShapeCollide(shapeTransformed, sphere);
	}

	doSphereAndSphereCollide(sphere0: Sphere, sphere1: Sphere): boolean
	{
		var displacement = this._displacement.overwriteWith
		(
			sphere1.center
		).subtract
		(
			sphere0.center
		);
		var distance = displacement.magnitude();
		var sumOfRadii = sphere0.radius() + sphere1.radius();
		var returnValue = (distance < sumOfRadii);

		return returnValue;
	}

	// boolean combinations

	doShapeContainerAndBoxCollide(container: ShapeContainer, box: BoxAxisAligned): boolean
	{
		return this.doShapeContainerAndShapeCollide(container, box);
	}

	doShapeContainerAndShapeCollide(container: ShapeContainer, shapeOther: Shape): boolean
	{
		return this.doesColliderContainOther(container.child, shapeOther);
	}

	doShapeContainerAndSphereCollide(container: ShapeContainer, sphere: Sphere): boolean
	{
		return this.doShapeContainerAndShapeCollide(container, sphere);
	}

	doShapeGroupAllAndBoxCollide(groupAll: ShapeGroupAll, shapeOther: Shape): boolean
	{
		return this.doShapeGroupAllAndShapeCollide(groupAll, shapeOther);
	}

	doShapeGroupAllAndMeshCollide(groupAll: ShapeGroupAll, mesh: Mesh): boolean
	{
		return this.doShapeGroupAllAndShapeCollide(groupAll, mesh);
	}

	doShapeGroupAllAndShapeCollide(groupAll: ShapeGroupAll, shapeOther: Shape): boolean
	{
		var returnValue = true;

		var shapesThis = groupAll.children;
		for (var i = 0; i < shapesThis.length; i++)
		{
			var shapeThis = shapesThis[i];
			var doShapesCollide = this.doCollidersCollide(shapeThis, shapeOther);
			if (doShapesCollide == false)
			{
				returnValue = false;
				break;
			}
		}

		return returnValue;
	}

	doShapeGroupAllAndSphereCollide(group: ShapeGroupAll, shape: Shape): boolean
	{
		return this.doShapeGroupAllAndShapeCollide(group, shape);
	}

	doShapeGroupAnyAndBoxCollide(groupAny: ShapeGroupAny, box: BoxAxisAligned): boolean
	{
		return this.doShapeGroupAnyAndShapeCollide(groupAny, box);
	}

	doShapeGroupAnyAndShapeCollide(groupAny: ShapeGroupAny, shapeOther: Shape): boolean
	{
		var returnValue = false;

		var shapesThis = groupAny.children;
		for (var i = 0; i < shapesThis.length; i++)
		{
			var shapeThis = shapesThis[i];
			var doShapesCollide = this.doCollidersCollide(shapeThis, shapeOther);
			if (doShapesCollide)
			{
				returnValue = true;
				break;
			}
		}

		return returnValue;
	}

	doShapeGroupAnyAndSphereCollide(group: ShapeGroupAny, sphere: Sphere): boolean
	{
		return this.doShapeGroupAnyAndShapeCollide(group, sphere);
	}

	doShapeInverseAndMeshCollide(inverse: ShapeInverse, mesh: Mesh): boolean
	{
		return this.doShapeInverseAndShapeCollide(inverse, mesh);
	}

	doShapeInverseAndBoxCollide(inverse: ShapeInverse, box: BoxAxisAligned): boolean
	{
		return this.doShapeInverseAndShapeCollide(inverse, box);
	}

	doShapeInverseAndShapeCollide(inverse: ShapeInverse, shapeOther: Shape): boolean
	{
		return (this.doCollidersCollide(inverse.child, shapeOther) == false);
	}

	doShapeInverseAndSphereCollide(inverse: ShapeInverse, sphere: Sphere): boolean
	{
		return this.doShapeInverseAndShapeCollide(inverse, sphere);
	}

	doShapeTransformedAndMeshCollide(shapeTransformed: ShapeTransformed, mesh: Mesh): boolean
	{
		return this.doShapeTransformedAndShapeCollide(shapeTransformed, mesh);
	}

	doShapeTransformedAndShapeCollide(shapeTransformed: ShapeTransformed, shapeOther: Shape): boolean
	{
		var shapeTransformedAfterTransformation =
			shapeTransformed.shapeAfterTransformation();
		return (this.doCollidersCollide(shapeTransformedAfterTransformation, shapeOther) );
	}

	doShapeTransformedAndSphereCollide(shapeTransformed: ShapeTransformed, sphere: Sphere): boolean
	{
		return this.doShapeTransformedAndShapeCollide(shapeTransformed, sphere);
	}

	// contains

	doesBoxContainBox(box0: BoxAxisAligned, box1: BoxAxisAligned): boolean
	{
		return box0.containsOther(box1);
	}

	doesBoxContainHemispace(box: BoxAxisAligned, hemispace: Hemispace): boolean
	{
		return false;
	}

	doesBoxContainMapLocated(box: BoxAxisAligned, mapLocated: MapLocated): boolean
	{
		throw new Error("Not implemented!");
	}

	doesBoxContainMesh(box: BoxAxisAligned, mesh: Mesh): boolean
	{
		var meshHasSomeVertexOutsideBox =
			mesh.vertices().some(x => box.containsPoint(x) == false);
		var meshVerticesAreAllInsideBox = (meshHasSomeVertexOutsideBox == false);
		return meshVerticesAreAllInsideBox;
	}

	doesBoxContainSphere(box: BoxAxisAligned, sphere: Sphere): boolean
	{
		var boxForSphere = BoxAxisAligned.fromCenterAndSize
		(
			sphere.center,
			Coords.ones().multiplyScalar(sphere.radius() * 2)
		);

		var returnValue = box.containsOther(boxForSphere);

		return returnValue;
	}

	doesHemispaceContainBox(hemispace: Hemispace, box: BoxAxisAligned): boolean
	{
		var returnValue = true;

		var vertices = Mesh.fromBox(box).vertices();
		for (var i = 0; i < vertices.length; i++)
		{
			var vertex = vertices[i];
			if (hemispace.containsPoint(vertex) == false)
			{
				returnValue = false;
				break;
			}
		}
		return returnValue;
	}

	doesHemispaceContainSphere(hemispace: Hemispace, sphere: Sphere): boolean
	{
		var plane = hemispace.plane;
		var distanceOfSphereCenterAbovePlane =
			sphere.center.dotProduct(plane.normal)
			- plane.distanceFromOrigin;
		var sphereRadius = sphere.radius();
		var returnValue = (distanceOfSphereCenterAbovePlane >= sphereRadius);
		return returnValue;
	}

	doesMapLocatedContainBox(mapLocated: MapLocated, box: BoxAxisAligned): boolean
	{
		throw new Error("Not implemented!");
	}

	doesMapLocatedContainMapLocated(mapLocated0: MapLocated, mapLocated1: MapLocated): boolean
	{
		throw new Error("Not implemented!");
	}

	doesMapLocatedContainSphere(mapLocated: MapLocated, box: BoxAxisAligned): boolean
	{
		throw new Error("Not implemented!");
	}

	doesMeshContainBox(mesh: Mesh, box: BoxAxisAligned): boolean
	{
		throw new Error("Not implemented!");
	}

	doesMeshContainSphere(mesh: Mesh, sphere: Sphere): boolean
	{
		throw new Error("Not implemented!");
	}

	doesPointContainPoint(point0: Coords, point1: Coords): boolean
	{
		throw new Error("Not implemented!");
	}

	doesShapeContainShapeGroupAll(shape: Shape, shapeGroupAll: ShapeGroupAll): boolean
	{
		throw new Error("Not implemented!");
	}

	doesShapeContainShapeGroupAny(shape: Shape, shapeGroupAny: ShapeGroupAny): boolean
	{
		throw new Error("Not implemented!");
	}

	doesShapeContainShapeInverse(shape: Shape, shapeInverse: ShapeInverse): boolean
	{
		throw new Error("Not implemented!");
	}

	doesShapeContainShapeTransformed(shape: Shape, shapeTransformed: ShapeTransformed): boolean
	{
		throw new Error("Not implemented!");
	}

	doesShapeGroupAllContainShape(shapeGroupAll: ShapeGroupAll, shape: Shape): boolean
	{
		throw new Error("Not implemented!");
	}

	doesShapeGroupAnyContainShape(shapeGroupAny: ShapeGroupAny, shape: Shape): boolean
	{
		throw new Error("Not implemented!");
	}

	doesShapeInverseContainShape(shapeInverse: ShapeInverse, shape: Shape): boolean
	{
		throw new Error("Not implemented!");
	}

	doesShapeTransformedContainShape(shapeTransformed: ShapeTransformed, shape: Shape): boolean
	{
		throw new Error("Not implemented!");
	}

	doesSphereContainBox(sphere: Sphere, box: BoxAxisAligned): boolean
	{
		var sphereCircumscribingBox =
			Sphere.fromCenterAndRadius
			(
				box.center,
				box.size.magnitude() / 2
			);
		var returnValue = sphere.containsOther(sphereCircumscribingBox);
		return returnValue;
	}

	doesSphereContainHemispace(sphere: Sphere, hemispace: Hemispace): boolean
	{
		return false;
	}

	doesSphereContainMapLocated(sphere: Sphere, mapLocated: MapLocated): boolean
	{
		throw new Error("Not implemented!");
	}

	doesSphereContainMesh(sphere: Sphere, mesh: Mesh): boolean
	{
		throw new Error("Not implemented!");
	}

	doesSphereContainSphere(sphere0: Sphere, sphere1: Sphere): boolean
	{
		return sphere0.containsOther(sphere1);
	}

	// Errors.

	throwOrLogError(errorMessage: string): void
	{
		if (this.throwErrorIfCollidersCannotBeCollided)
		{
			throw new Error(errorMessage);
		}
		else
		{
			console.log(errorMessage);
		}
	}

	throwOrLogErrorForColliderTypeNames
	(
		collider0TypeName: string,
		collider1TypeName: string
	): void
	{
		var errorMessage =
		"Error! Colliders of types cannot be collided: "
		+ collider0TypeName + ", " + collider1TypeName;

		this.throwOrLogError(errorMessage);
	}

}

}
