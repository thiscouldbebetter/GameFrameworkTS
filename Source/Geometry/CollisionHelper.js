
class CollisionHelper
{
	constructor()
	{
		this.throwErrorIfCollidersCannotBeCollided = true;

		this.colliderTypeNamesToDoCollideLookup = this.doCollideLookupBuild();
		this.colliderTypeNamesToDoesContainLookup = this.doesContainLookupBuild();
		this.colliderTypeNamesToCollideLookup = this.collisionResponseLookupBuild();

		// Helper variables.
		this._box = new Box(new Coords(), new Coords());
		this._collision = new Collision(new Coords());
		this._displacement = new Coords();
		this._polar = new Polar();
		this._pos = new Coords();
		this._range = new Range();
		this._range2 = new Range();
		this._size = new Coords();
	}

	// constructor helpers

	collisionResponseLookupBuild()
	{
		var lookupOfLookups = {};
		var lookup;

		var notDefined = typeof NonexistentClass;

		var boxName = ( typeof Box == notDefined ? null : Box.name );
		var mapLocatedName = ( typeof MapLocated == notDefined ? null : MapLocated.name );
		var meshName = ( typeof Mesh == notDefined ? null : Mesh.name );
		var boxRotatedName = ( typeof BoxRotated == notDefined ? null : BoxRotated.name );
		var shapeGroupAllName = ( typeof ShapeGroupAll == notDefined ? null : ShapeGroupAll.name );
		var sphereName = ( typeof Sphere == notDefined ? null : Sphere.name );

		if (boxName != null)
		{
			lookup = {};
			lookup[sphereName] = this.collideCollidablesBoxAndSphere;
			lookupOfLookups[boxName] = lookup;
		}

		if (mapLocatedName != null)
		{
			lookup = {};
			lookup[sphereName] = this.collideCollidablesReverseVelocities;
			lookupOfLookups[mapLocatedName] = lookup;
		}

		if (meshName != null)
		{
			lookup = {};
			lookup[mapLocatedName] = this.collideCollidablesReverseVelocities;
			lookup[meshName] = this.collideCollidablesReverseVelocities;
			lookup[shapeGroupAllName] = this.collideCollidablesReverseVelocities;
			lookup[sphereName] = this.collideCollidablesReverseVelocities;
			lookupOfLookups[meshName] = lookup;
		}

		if (boxRotatedName != null)
		{
			lookup = {};
			lookup[sphereName] = this.collideCollidablesBoxRotatedAndSphere;
			lookupOfLookups[boxRotatedName] = lookup;
		}

		if (shapeGroupAllName != null)
		{
			lookup = {};
			lookup[sphereName] = this.collideCollidablesSphereAndShapeGroupAll;
			lookupOfLookups[shapeGroupAllName] = lookup;
		}

		if (sphereName != null)
		{
			lookup = {};
			lookup[boxName] = this.collideCollidablesSphereAndBox;
			lookup[mapLocatedName] = this.collideCollidablesReverseVelocities;
			lookup[meshName] = this.collideCollidablesReverseVelocities;
			lookup[boxRotatedName] = this.collideCollidablesSphereAndBoxRotated;
			lookup[shapeGroupAllName] = this.collideCollidablesReverseVelocities;
			lookup[sphereName] = this.collideCollidablesSphereAndSphere;
			lookupOfLookups[sphereName] = lookup;
		}

		return lookupOfLookups;
	};

	doCollideLookupBuild()
	{
		var lookupOfLookups = {};

		var andText = "And";
		var collideText = "Collide";
		var doText = "do";

		var functionNames = Object.getOwnPropertyNames(this.__proto__);
		var functionNamesDoCollide = functionNames.filter(
			x => x.startsWith(doText) && x.endsWith(collideText) && x.indexOf(andText) >= 0
		);

		for (var i = 0; i < functionNamesDoCollide.length; i++)
		{
			var functionName = functionNamesDoCollide[i];

			var colliderTypeNamesAsString = functionName.substr
			(
				doText.length,
				functionName.length - doText.length - collideText.length
			);

			var colliderTypeNames = colliderTypeNamesAsString.split(andText);
			var colliderTypeName0 = colliderTypeNames[0];
			var colliderTypeName1 = colliderTypeNames[1];

			var lookup = lookupOfLookups[colliderTypeName0];
			if (lookup == null)
			{
				lookup = {};
				lookupOfLookups[colliderTypeName0] = lookup;
			}
			var doCollideFunction = this[functionName];
			lookup[colliderTypeName1] = doCollideFunction;
		}

		return lookupOfLookups;
	};

	doesContainLookupBuild()
	{
		var lookupOfLookups = {};

		var containText = "Contain";
		var doesText = "does";

		var functionNames = Object.getOwnPropertyNames(this.__proto__);
		var functionNamesDoesContain = functionNames.filter(
			x => x.startsWith(doesText) && x.indexOf(containText) >= 0
		);

		for (var i = 0; i < functionNamesDoesContain.length; i++)
		{
			var functionName = functionNamesDoesContain[i];

			var colliderTypeNamesAsString = functionName.substr
			(
				doesText.length
			);

			var colliderTypeNames = colliderTypeNamesAsString.split(containText);
			var colliderTypeName0 = colliderTypeNames[0];
			var colliderTypeName1 = colliderTypeNames[1];

			var lookup = lookupOfLookups[colliderTypeName0];
			if (lookup == null)
			{
				lookup = {};
				lookupOfLookups[colliderTypeName0] = lookup;
			}
			var doesContainFunction = this[functionName];
			lookup[colliderTypeName1] = doesContainFunction;
		}

		return lookupOfLookups;
	};

	// instance methods

	collideCollidables(entityColliding, entityCollidedWith)
	{
		var returnValue;

		var collider0 = entityColliding.collidable.collider;
		var collider1 = entityCollidedWith.collidable.collider;

		while (collider0.collider != null)
		{
			collider0 = collider0.collider();
		}

		while (collider1.collider != null)
		{
			collider1 = collider1.collider();
		}

		var collider0TypeName = collider0.constructor.name;
		var collider1TypeName = collider1.constructor.name;

		var collideLookup =
			this.colliderTypeNamesToCollideLookup[collider0TypeName];
		if (collideLookup == null)
		{
			if (this.throwErrorIfCollidersCannotBeCollided)
			{
				throw "Error!  Colliders of types cannot be collided: " + collider0TypeName + "," + collider1TypeName;
			}
		}
		else
		{
			var collisionMethod = collideLookup[collider1TypeName];
			if (collisionMethod == null)
			{
				if (this.throwErrorIfCollidersCannotBeCollided)
				{
					throw "Error!  Colliders of types cannot be collided: " + collider0TypeName + "," + collider1TypeName;
				}
			}
			else
			{
				returnValue = collisionMethod.call
				(
					this, entityColliding, entityCollidedWith
				);
			}
		}

		return returnValue;
	};

	collisionClosest(collisionsToCheck)
	{
		var returnValue = collisionsToCheck.filter
		(
			x => x.isActive
		).sort
		(
			(x, y) => x.distanceToCollision < y.distanceToCollision
		)[0];

		return returnValue;
	};

	collisionsOfEntitiesCollidableInSets(entitiesCollidable0, entitiesCollidable1)
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
					var collision = new Collision();
					collision.collidables.push(collidableFromSet0);
					collision.collidables.push(collidableFromSet1);
					returnValues.push(collision);
				}
			}
		}

		return returnValues;
	};

	doEntitiesCollide(entity0, entity1)
	{
		var collidable0 = entity0.collidable;
		var collidable1 = entity1.collidable;

		var doCollide = this.doCollidablesCollide
		(
			collidable0, collidable1
		);
		var wereEntitiesAlreadyColliding =
		(
			collidable0.entitiesAlreadyCollidedWith.contains(entity1)
			|| collidable1.entitiesAlreadyCollidedWith.contains(entity0)
		);

		if (doCollide)
		{
			if (wereEntitiesAlreadyColliding)
			{
				doCollide = false;
			}
			else
			{
				collidable0.entitiesAlreadyCollidedWith.push(entity1);
				collidable1.entitiesAlreadyCollidedWith.push(entity0);
			}
		}
		else
		{
			if (wereEntitiesAlreadyColliding)
			{
				collidable0.entitiesAlreadyCollidedWith.remove(entity1);
				collidable1.entitiesAlreadyCollidedWith.remove(entity0);
			}
		}

		return doCollide;
	};

	doCollidablesCollide(collidable0, collidable1)
	{
		var doCollidersCollide = false;

		var canCollidablesCollideYet =
		(
			collidable0.ticksUntilCanCollide <= 0
			&& collidable1.ticksUntilCanCollide <= 0
		);

		if (canCollidablesCollideYet)
		{
			var doBoxesCollide =
			(
				collidable0.Boundable == null
				|| collidable1.Boundable == null
				|| this.doCollidersCollide(collidable0.Boundable.bounds, collidable0.Boundable.bounds)
			);

			if (doBoxesCollide)
			{
				var collider0 = collidable0.collider;
				var collider1 = collidable1.collider;

				doCollidersCollide = this.doCollidersCollide(collider0, collider1);
			}
		}

		return doCollidersCollide;
	};

	doCollidersCollide(collider0, collider1)
	{
		var returnValue = false;

		while (collider0.collider != null)
		{
			collider0 = collider0.collider();
		}

		while (collider1.collider != null)
		{
			collider1 = collider1.collider();
		}

		var collider0TypeName = collider0.constructor.name;
		var collider1TypeName = collider1.constructor.name;

		var doCollideLookup =
			this.colliderTypeNamesToDoCollideLookup[collider0TypeName];
		if (doCollideLookup == null)
		{
			if (this.throwErrorIfCollidersCannotBeCollided)
			{
				throw "Error: Colliders of types cannot be collided: " + collider0TypeName + ", " + collider1TypeName;
			}
		}
		else
		{
			var collisionMethod = doCollideLookup[collider1TypeName];
			if (collisionMethod == null)
			{
				if (this.throwErrorIfCollidersCannotBeCollided)
				{
					throw "Error: Colliders of types cannot be collided: " + collider0TypeName + ", " + collider1TypeName;
				}
			}
			else
			{
				returnValue = collisionMethod.call
				(
					this, collider0, collider1
				);
			}
		}

		return returnValue;
	};

	doesColliderContainOther(collider0, collider1)
	{
		var returnValue = false;

		while (collider0.collider != null)
		{
			collider0 = collider0.collider();
		}

		while (collider1.collider != null)
		{
			collider1 = collider1.collider();
		}

		var collider0TypeName = collider0.constructor.name;
		var collider1TypeName = collider1.constructor.name;

		var doesContainLookup =
			this.colliderTypeNamesToDoesContainLookup[collider0TypeName];
		if (doesContainLookup == null)
		{
			if (this.throwErrorIfCollidersCannotBeCollided)
			{
				throw "Error: Colliders of types cannot be collided: " + collider0TypeName + ", " + collider1TypeName;
			}
		}
		else
		{
			var doesColliderContainOther = doesContainLookup[collider1TypeName];
			if (doesColliderContainOther == null)
			{
				if (this.throwErrorIfCollidersCannotBeCollided)
				{
					throw "Error: Colliders of types cannot be collided: " + collider0TypeName + ", " + collider1TypeName;
				}
			}
			else
			{
				returnValue = doesColliderContainOther.call
				(
					this, collider0, collider1
				);
			}
		}

		return returnValue;
	};

	// shapes

	// collideCollidablesXAndY

	collideCollidablesReverseVelocities(collidable0, collidable1)
	{
		// todo
		// A simple collision response for shape pairs not yet implemented.

		collidable0.locatable.loc.vel.invert();
		collidable1.locatable.loc.vel.invert();
	};

	collideCollidablesBoxAndSphere(entityBox, entitySphere)
	{
		var sphereLoc = entitySphere.locatable.loc;
		var boxLoc = entityBox.locatable.loc;

		var box = entityBox.collidable.collider;
		var sphere = entitySphere.collidable.collider;
		var collision = this.collisionOfBoxAndSphere(box, sphere, this._collision);

		var collisionRelativeToBox = this._pos.overwriteWith(collision.pos).subtract
		(
			box.center
		).divide
		(
			box.sizeHalf
		);

		if (Math.abs(collisionRelativeToBox.x) >= Math.abs(collisionRelativeToBox.y))
		{
			sphereLoc.vel.x *= -1;
		}
		else
		{
			sphereLoc.vel.y *= -1;
		}
	};

	collideCollidablesBoxRotatedAndSphere(entityBoxRotated, entitySphere)
	{
		var rectangle = entityBoxRotated.collidable.collider;
		var sphere = entitySphere.collidable.collider;
		var collision = this.collisionOfBoxRotatedAndSphere
		(
			rectangle, sphere, this._collision, true //shouldCalculatePos
		);

		var normal = collision.normals[0];

		var sphereVel = entitySphere.locatable.loc.vel;
		sphereVel.add
		(
			normal.clone().multiplyScalar
			(
				sphereVel.dotProduct(normal) * -2
			)
		);

		var rectangleVel = entityBoxRotated.locatable.loc.vel;
		rectangleVel.add
		(
			normal.clone().multiplyScalar
			(
				rectangleVel.dotProduct(normal) * -2
			)
		);

		var rectangleVel
	};

	collideCollidablesSphereAndBox(entitySphere, entityBox)
	{
		this.collideCollidablesBoxAndSphere(entityBox, entitySphere);
	};

	collideCollidablesSphereAndBoxRotated(entitySphere, entityBoxRotated)
	{
		this.collideCollidablesBoxRotatedAndSphere(entityBoxRotated, entitySphere);
	};

	collideCollidablesSphereAndShapeGroupAll(entitySphere, entityShapeGroupAll)
	{
		// todo
		this.collideCollidablesReverseVelocities(entitySphere, entityShapeGroupAll);
	};

	collideCollidablesSphereAndSphere(entityColliding, entityCollidedWith)
	{
		var entityCollidingLoc = entityColliding.locatable.loc;
		var entityCollidedWithLoc = entityCollidedWith.locatable.loc;

		var entityCollidingPos = entityCollidingLoc.pos;
		var entityCollidedWithPos = entityCollidedWithLoc.pos;

		var displacement = this._displacement.overwriteWith
		(
			entityCollidedWithPos
		).subtract
		(
			entityCollidingPos
		);

		var distance = displacement.magnitude();

		var direction = displacement.divideScalar(distance);

		var sumOfRadii =
			entityColliding.collidable.collider.radius
			+ entityCollidedWith.collidable.collider.radius;

		entityCollidedWithPos.overwriteWith
		(
			direction
		).multiplyScalar
		(
			sumOfRadii
		).add
		(
			entityCollidingPos
		);

		var speedAlongRadius = entityCollidedWithLoc.vel.dotProduct(direction);

		var accelOfReflection = direction.multiplyScalar(speedAlongRadius * 2);

		entityCollidedWithLoc.accel.subtract(accelOfReflection);
	};

	// collisionOfXAndY

	collisionOfBoxAndBox(box1, box2, collision)
	{
		if (collision == null)
		{
			collision = new Collision();
		}

		var boxOfIntersection = box1.intersectWith(box2);
		if (boxOfIntersection != null)
		{
			collision.isActive = true;
			collision.pos.overwriteWith(boxOfIntersection.center)
		}

		return collision;
	};

	collisionOfBoxAndSphere(box, sphere, collision, shouldCalculatePos)
	{
		var doCollide = false;

		var displacementBetweenCenters = this._displacement.overwriteWith
		(
			sphere.center
		).subtract
		(
			box.center
		);

		var displacementBetweenCentersAbsolute =
			displacementBetweenCenters.absolute();

		var boxSizeHalf = box.sizeHalf;
		var sphereRadius = sphere.radius;

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
			collision = new Collision();
		}

		collision.isActive = doCollide;

		if (doCollide && shouldCalculatePos)
		{
			// todo - Fix this.
			var boxCircumscribedAroundSphere = new Box(sphere.center, new Coords(1, 1, 1).multiplyScalar(sphere.radius));
			collision = this.collisionOfBoxAndBox(box, boxCircumscribedAroundSphere, collision);
		}

		return collision;
	};

	collisionOfHemispaceAndSphere(hemispace, sphere, collision)
	{
		if (collision == null)
		{
			collision = new Collision();
		}

		var plane = hemispace.plane;
		var distanceOfSphereCenterFromOriginAlongNormal =
			sphere.center.dotProduct(plane.normal);
		var distanceOfSphereCenterAbovePlane =
			distanceOfSphereCenterFromOriginAlongNormal
			- plane.distanceFromOrigin;
		if (distanceOfSphereCenterAbovePlane < sphere.radius)
		{
			collision.isActive = true;
			plane.pointClosestToOrigin(collision.pos);
			collision.colliders.length = 0;
			collision.colliders.push(hemispace);
		}
		return collision;
	};

	collisionOfEdgeAndEdge(edge0, edge1, collision)
	{
		// 2D

		if (collision == null)
		{
			collision = new Collision();
		}
		collision.clear();

		var edge0Bounds = edge0.box();
		var edge1Bounds = edge1.box();

		var doBoundsOverlap = edge0Bounds.overlapsWith(edge1Bounds);

		if (doBoundsOverlap)
		{
			var edge0ProjectedOntoEdge1 = edge0.clone().projectOntoOther(edge1);
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
					collision.colliders.Edge = edge1;
				}

			} // end if (doesEdgeCrossLineOfOther)

		} // end if (doBoundsOverlap)

		return collision;
	};

	collisionOfEdgeAndFace(edge, face, collision)
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
				var colliders = collision.colliders;
				colliders.push(face);
				colliders.Face = face;
			}
		}

		return collision;
	};

	collisionsOfEdgeAndMesh(edge, mesh, collisions, stopAfterFirst)
	{
		if (collisions == null)
		{
			collisions = [];
		}

		var meshFaces = mesh.faces();
		for (var i = 0; i < meshFaces.length; i++)
		{
			var meshFace = meshFaces[i];
			var collision = this.collisionOfEdgeAndFace(edge, meshFace);
			if (collision != null && collision.isActive)
			{
				collision.colliders.push(mesh);
				collision.colliders.Mesh = mesh;
				collisions.push(collision);
				if (stopAfterFirst)
				{
					break;
				}
			}
		}

		return collisions;
	};

	collisionOfEdgeAndPlane(edge, plane, collision)
	{
		if (collision == null)
		{
			collision = new Collision();
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
				colliders.length = 0;
				colliders.push(edge);
				colliders.Edge = edge;
				colliders.push(plane);
				colliders.Plane = plane;
			}
		}

		return returnValue;
	};

	collisionOfBoxRotatedAndSphere
	(
		boxRotated, sphere, collision, shouldCalculatePos
	)
	{
		if (collision == null)
		{
			collision = new Collision();
		}

		var doCollide = this.doBoxRotatedAndSphereCollide
		(
			boxRotated, sphere
		);

		if (doCollide)
		{
			var collisionPos = collision.pos;
			var rectangleCenter = boxRotated.box.center;
			var displacementBetweenCenters = collisionPos.overwriteWith
			(
				sphere.center
			).subtract
			(
				rectangleCenter
			);

			var distanceBetweenCenters = displacementBetweenCenters.magnitude();
			var distanceFromRectangleCenterToSphere =
				distanceBetweenCenters - sphere.radius;
			var displacementToSphere = displacementBetweenCenters.divideScalar
			(
				distanceBetweenCenters
			).multiplyScalar
			(
				distanceFromRectangleCenterToSphere
			);

			collisionPos = displacementToSphere.add(rectangleCenter);

			var normals = collision.normals;
			normals[0].overwriteWith
			(
				boxRotated.surfaceNormalNearPos(collision.pos)
			);
			normals[1].overwriteWith(normals[0]).invert();

			var colliders = collision.colliders;
			colliders[0] = boxRotated;
			colliders[1] = sphere;

			return collision;
		}

		return collision;
	};

	// doXAndYCollide

	doBoxAndBoxCollide(box0, box1)
	{
		var returnValue = box0.overlapsWith(box1);
		return returnValue;
	};

	doBoxAndCylinderCollide(box, cylinder)
	{
		var returnValue = false;

		var displacementBetweenCenters = this._displacement.overwriteWith
		(
			box.center
		).subtract
		(
			cylinder.center
		);

		if (displacementBetweenCenters.z < box.sizeHalf.z + cylinder.lengthHalf);
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
	};

	doBoxAndMapLocatedCollide(box, mapLocated)
	{
		// todo
		return this.doBoxAndBoxCollide(box, mapLocated.box);
	};

	doBoxAndHemispaceCollide(box, hemispace)
	{
		var returnValue = false;

		var vertices = Mesh.fromBox(box).vertices();
		for (var i = 0; i < vertices.length; i++)
		{
			var vertex = vertices[v];
			if (hemispace.containsPoint(vertex))
			{
				returnValue = true;
				break;
			}
		}
		return returnValue;
	};

	doBoxAndBoxRotatedCollide(box, boxRotated)
	{
		// todo
		var boxRotatedAsSphere = boxRotated.sphereSwept();
		return this.doBoxAndSphereCollide(box, boxRotatedAsSphere);
	};

	doBoxAndSphereCollide(box, sphere)
	{
		return this.collisionOfBoxAndSphere(box, sphere, this._collision, false).isActive;
	};

	doCylinderAndCylinderCollide(cylinder0, cylinder1)
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
		var sumOfRadii = sphere0.radius + sphere1.radius;
		var doRadiiOverlap = (distance < sumOfRadii);
		if (doRadiiOverlap)
		{
			var doLengthsOverlap =
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

			if (doLengthsOverlap)
			{
				returnValue = true;
			}
		}

		return returnValue;
	};

	doEdgeAndFaceCollide(edge, face, collision)
	{
		return (this.collisionOfEdgeAndFace(edge, face, collision).isActive);
	};

	doEdgeAndHemispaceCollide(edge, hemispace)
	{
		var vertices = edge.vertices;
		var returnValue = ( hemispace.containsPoint(vertices[0]) || hemispace.containsPoint(vertices[1]) );
		return returnValue;
	};

	doEdgeAndMeshCollide(edge, mesh)
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
				returnValue = this.doEdgeAndFaceCollide(edge, face);
				if (returnValue == true)
				{
					break;
				}
			}
		}

		return returnValue;
	};

	doEdgeAndPlaneCollide(edge, plane)
	{
		return (this.collisionOfEdgeAndPlane(edge, plane, this._collision.clear()) != null);
	};

	doHemispaceAndSphereCollide(hemispace, sphere)
	{
		var collision = this.collisionOfHemispaceAndSphere(hemispace, sphere, this._collision.clear());

		return collision.isActive;
	};

	doMeshAndMeshCollide(mesh0, mesh1)
	{
		var returnValue = true;

		// hack - Meshes are assumed to be convex.

		var meshVertices = [ mesh0.vertices(), mesh1.vertices() ];
		var meshFaces = [ mesh0.faces(), mesh1.faces() ];

		for (var m = 0; m < 2; m++)
		{
			var meshThisFaces = meshFaces[m];
			var meshThisVertices = meshVertices[m];
			var meshOtherVertices = meshOtherVertices[m];

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
	};

	doMapLocatedAndBoxCollide(mapLocated, box)
	{
		return this.doBoxAndMapLocatedCollide(box, mapLocated);
	};

	doMapLocatedAndMapLocatedCollide(mapLocated0, mapLocated1)
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

		var cell0 = map0.cellPrototype.clone();
		var cell1 = map1.cellPrototype.clone();

		var cell0PosAbsolute = new Coords();

		var cell0PosInCells = new Coords();
		var cell1PosInCells = new Coords();

		var cell1PosInCellsMin = new Coords();
		var cell1PosInCellsMax = new Coords();

		var map0SizeInCells = map0.sizeInCells;
		var map1SizeInCells = map1.sizeInCells;

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

				cell0 = map0.cellAtPosInCells(map0, cell0PosInCells, cell0);

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
								cell1 = map1.cellAtPosInCells(map1, cell1PosInCells, cell1);

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
	};

	doMapLocatedAndSphereCollide(mapLocated, sphere)
	{
		var returnValue = false;

		var doBoundsCollide =
			this.doBoxAndSphereCollide(mapLocated.box, sphere);

		if (doBoundsCollide == false)
		{
			return false;
		}

		var map = mapLocated.map;
		var cell = map.cellPrototype.clone();
		var cellPosAbsolute = new Coords();
		var cellPosInCells = new Coords();
		var mapSizeInCells = map.sizeInCells;
		var mapCellSize = map.cellSize;
		var mapSizeHalf = map.sizeHalf;
		var mapPos = mapLocated.loc.pos;
		var cellAsBox = new Box( new Coords(), map.cellSize );

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;
			cellPosAbsolute.y = (y * mapCellSize.y) + mapPos.y - mapSizeHalf.y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;
				cellPosAbsolute.x = (x * mapCellSize.x) + mapPos.x - mapSizeHalf.x;

				cell = map.cellAtPosInCells(map, cellPosInCells, cell);

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
	};

	doMeshAndSphereCollide(mesh, sphere)
	{
		var returnValue = true;

		// hack - Mesh is assumed to be convex.

		var meshFaces = mesh.faces();
		var hemispace = new Hemispace();

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
	};

	doBoxRotatedAndBoxCollide(boxRotated, box)
	{
		return this.doBoxAndBoxRotatedCollide(box, boxRotated);
	};

	doBoxRotatedAndSphereCollide(boxRotated, sphere)
	{
		var box = boxRotated.box;
		var center = box.center;
		var sphereCenter = sphere.center;
		var sphereCenterToRestore = this._pos.overwriteWith(sphereCenter);
		sphereCenter.subtract(center);
		var polar = this._polar;
		polar.azimuthInTurns = boxRotated.angleInTurns;
		polar.radius = 1;
		var rectangleAxisX = polar.toCoords(new Coords());
		polar.azimuthInTurns += .25;
		var rectangleAxisY = polar.toCoords(new Coords());
		var x = sphereCenter.dotProduct(rectangleAxisX);
		var y = sphereCenter.dotProduct(rectangleAxisY);
		sphereCenter.x = x;
		sphereCenter.y = y;
		sphereCenter.add(box.center);
		var returnValue = this.doBoxAndSphereCollide(box, sphere);
		sphereCenter.overwriteWith(sphereCenterToRestore);
		return returnValue;
	};

	doSphereAndBoxCollide(sphere, box)
	{
		return this.doBoxAndSphereCollide(box, sphere);
	};

	doSphereAndMapLocatedCollide(sphere, mapLocated)
	{
		return this.doMapLocatedAndSphereCollide(mapLocated, sphere);
	};

	doSphereAndMeshCollide(sphere, mesh)
	{
		return this.doMeshAndSphereCollide(mesh, sphere);
	};

	doSphereAndBoxRotatedCollide(sphere, boxRotated)
	{
		return this.doBoxRotatedAndSphereCollide(boxRotated, sphere);
	};

	doSphereAndShapeContainerCollide(sphere, shapeContainer)
	{
		return this.doShapeContainerAndShapeCollide(shapeContainer, sphere);
	};

	doSphereAndShapeGroupAllCollide(sphere, shapeGroupAll)
	{
		return this.doShapeGroupAllAndShapeCollide(shapeGroupAll, sphere);
	};

	doSphereAndShapeGroupAnyCollide(sphere, shapeGroupAny)
	{
		return this.doShapeGroupAnyAndShapeCollide(shapeGroupAny, sphere);
	};

	doSphereAndShapeInverseCollide(sphere, shapeInverse)
	{
		return this.doShapeInverseAndShapeCollide(shapeInverse, sphere);
	};

	doSphereAndSphereCollide(sphere0, sphere1)
	{
		var displacement = this._displacement.overwriteWith
		(
			sphere1.center
		).subtract
		(
			sphere0.center
		);
		var distance = displacement.magnitude();
		var sumOfRadii = sphere0.radius + sphere1.radius;
		var returnValue = (distance < sumOfRadii);

		return returnValue;
	};

	// boolean combinations

	doShapeGroupAllAndShapeCollide(groupAll, shapeOther)
	{
		var returnValue = true;

		var shapesThis = groupAll.shapes;
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
	};

	doShapeGroupAnyAndShapeCollide(groupAny, shapeOther)
	{
		var returnValue = false;

		var shapesThis = groupAny.shapes;
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
	};

	doShapeContainerAndShapeCollide(container, shapeOther)
	{
		return this.doesColliderContainOther(container.shape, shapeOther);
	};

	doShapeInverseAndShapeCollide(inverse, shapeOther)
	{
		return (this.doCollidersCollide(inverse.shape, shapeOther) == false);
	};

	doBoxAndShapeGroupAllCollide(shape, group)
	{
		return this.doShapeGroupAllAndShapeCollide(group, shape);
	};

	doShapeGroupAllAndSphereCollide(group, shape)
	{
		return this.doShapeGroupAllAndShapeCollide(group, shape);
	};

	doBoxAndShapeGroupAnyCollide(shape, group)
	{
		return this.doShapeGroupAnyAndShapeCollide(group, shape);
	};

	doShapeContainerAndSphereCollide(container, sphere)
	{
		return this.doShapeContainerAndShapeCollide(container, sphere);
	};

	doShapeGroupAnyAndSphereCollide(group, shape)
	{
		return this.doShapeGroupAnyAndShapeCollide(group, shape);
	};

	doShapeInverseAndSphereCollide(inverse, shape)
	{
		return this.doShapeInverseAndShapeCollide(inverse, shape);
	};

	// contains

	doesBoxContainBox(box0, box1)
	{
		return box0.containsOther(box1);
	};

	doesBoxContainHemispace(box, hemispace)
	{
		return false;
	};

	doesBoxContainSphere(box, sphere)
	{
		var boxForSphere = new Box
		(
			sphere.center, new Coords(1, 1, 1).multiplyScalar(sphere.radius * 2)
		);

		var returnValue = box.containsOther(boxForSphere);

		return returnValue;
	};

	doesHemispaceContainBox(hemispace, box)
	{
		var returnValue = true;

		var vertices = Mesh.fromBox(box).vertices;
		for (var i = 0; i < vertices.length; i++)
		{
			var vertex = vertices[v];
			if (hemispace.containsPoint(vertex) == false)
			{
				returnValue = false;
				break;
			}
		}
		return returnValue;
	};

	doesHemispaceContainSphere(hemispace, sphere)
	{
		var plane = hemispace.plane;
		var distanceOfSphereCenterAbovePlane =
			sphere.center.dotProduct(plane.normal)
			- plane.distanceFromOrigin;
		var returnValue = (distanceOfSphereCenterAbovePlane >= sphere.radius);
		return returnValue;
	};

	doesSphereContainBox(sphere, box)
	{
		var sphereCircumscribingBox = new Sphere(box.center, box.max().magnitude());
		var returnValue = sphere.containsOther(sphereCircumscribingBox);
		return returnValue;
	};

	doesSphereContainHemispace(sphere, hemispace)
	{
		return false;
	};

	doesSphereContainSphere(sphere0, sphere1)
	{
		return sphere0.containsOther(sphere1);
	};
}
