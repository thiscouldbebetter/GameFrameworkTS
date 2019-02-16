
function CollisionHelper()
{
	this.throwErrorIfCollidersCannotBeCollided = false;

	// Helper variables.
	this.displacement = new Coords();
}
{
	CollisionHelper.prototype.collisionsOfCollidablesInSets = function(collidableSet0, collidableSet1)
	{
		var returnValues = [];

		var numberOfCollidablesInSet0 = collidableSet0.length;
		var numberOfCollidablesInSet1 = collidableSet1.length;

		for (var i = 0; i < numberOfCollidablesInSet0; i++)
		{
			var collidableFromSet0 = collidableSet0[i];

			for (var j = 0; j < numberOfCollidablesInSet1; j++)
			{
				var collidableFromSet1 = collidableSet1[j];

				if (this.doCollidablesCollide(collidableFromSet0, collidableFromSet1) == true)
				{
					var collision = new Collision
					(
						null, // pos
						null, // distanceToCollision
						[collidableFromSet0, collidableFromSet1]
					);
					returnValues.push(collision);
				}
			}
		}

		return returnValues;
	};

	CollisionHelper.prototype.doCollidablesCollide = function(collidable0, collidable1)
	{
		var collider0 = collidable0.collider();
		var collider1 = collidable1.collider();

		var doCollidersCollide = this.doCollidersCollide(collider0, collider1);

		return doCollidersCollide;
	};

	CollisionHelper.prototype.doCollidersCollide = function(collider0, collider1)
	{
		var returnValue;

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

		if (collider0TypeName <= collider1TypeName)
		{
			collidersAlphabetized = [ collider0, collider1 ];
		}
		else
		{
			collidersAlphabetized = [ collider1, collider0 ];
		}

		var colliderTypeNamesConcatenated =
			collidersAlphabetized[0].constructor.name
			+ "And"
			+ collidersAlphabetized[1].constructor.name;
		var collisionMethodName = "do" + colliderTypeNamesConcatenated + "Collide";
		var collisionMethod = this[collisionMethodName];

		if (collisionMethod == null)
		{
			if (this.throwErrorIfCollidersCannotBeCollided == true)
			{
				throw "Error - No collision method in CollisionHelper named " + collisionMethodName;
			}
		}
		else
		{
			returnValue = collisionMethod.call(this, collidersAlphabetized[0], collidersAlphabetized[1]);
		}

		return returnValue;
	};

	CollisionHelper.prototype.doesColliderContainOther = function(collider0, collider1)
	{
		var returnValue;

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

		var containsMethodName = "does" + collider0TypeName + "Contain" + collider1TypeName;
		var containsMethod = this[containsMethodName];

		if (containsMethod == null)
		{
			throw "Error - No contains method in CollisionHelper named " + containsMethodName;
		}
		else
		{
			returnValue = containsMethod.call(this, collider0, collider1);
		}

		return returnValue;
	};

	// shapes

	// collisions

	CollisionHelper.prototype.collisionOfEdgeAndFace = function(edge, face)
	{
		var facePlane = face.plane();

		var returnValue = this.collisionOfEdgeAndPlane(edge, facePlane);

		if (returnValue != null)
		{
			var faceVertices = face.vertices;

			var faceEdgeAsPlane = new Plane(new Coords());
			var faceNormal = facePlane.normal;
			var faceVertexPlusFaceNormal = new Coords();

			var faceVertexPrev = faceVertices[faceVertices.length - 1];
			for (var i = 0; i < faceVertices.length; i++)
			{
				var faceVertex = faceVertices[i];
				faceVertexPlusFaceNormal.overwriteWith
				(
					faceVertex
				).add
				(
					faceNormal
				);
				faceEdgeAsPlane.fromPoints
				(
					// Order matters!
					faceVertex, faceVertexPrev, faceVertexPlusFaceNormal
				);

				var hemispace = new Hemispace(faceEdgeAsPlane);
				var doEdgeAndHemispaceCollide = this.doEdgeAndHemispaceCollide(edge, hemispace);
				if (doEdgeAndHemispaceCollide == false)
				{
					returnValue = null;
					break;
				}

				faceVertexPrev = faceVertex;
			}
		}

		if (returnValue != null)
		{
			returnValue.collider = face;
		}

		return returnValue;
	};

	CollisionHelper.prototype.collisionsOfEdgeAndMesh = function(edge, mesh, collisions, stopAfterFirst)
	{
		if (collisions == null)
		{
			collisions = [];
		}

		var meshFaces = mesh.faces();
		for (var i = 0; i < meshFaces.length; i++)
		{
			var meshFace = meshFaces[i];
			var collisionOfEdgeAndFace = this.collisionOfEdgeAndFace(edge, meshFace);
			if (collisionOfEdgeAndFace != null)
			{
				collisions.push(collisionOfEdgeAndFace);
				if (stopAfterFirst == true)
				{
					break;
				}
			}
		}

		return collisions;
	};

	CollisionHelper.prototype.collisionOfEdgeAndPlane = function(edge, plane)
	{
		var returnValue = null;

		var edgeDirection = edge.direction();
		var planeNormal = plane.normal;

		var distanceToCollision =
			(
				plane.distanceFromOrigin
				- planeNormal.dotProduct(edge.vertices[0])
			)
			/ planeNormal.dotProduct(edgeDirection);

		if (distanceToCollision >= 0 && distanceToCollision <= edge.length())
		{
			var collisionPos = new Coords().overwriteWith
			(
				edgeDirection
			).multiplyScalar
			(
				distanceToCollision
			).add
			(
				edge.vertices[0]
			);

			returnValue = new Collision(collisionPos, distanceToCollision, plane);
		}

		return returnValue;
	};

	CollisionHelper.prototype.doBoundsAndBoundsCollide = function(bounds0, bounds1)
	{
		var returnValue = bounds0.overlapsWith(bounds1);
		return returnValue;
	};

	CollisionHelper.prototype.doBoundsAndCylinderCollide = function(bounds, cylinder)
	{
		var returnValue = false;

		var displacementBetweenCenters = this.displacement.overwriteWith
		(
			bounds.center
		).subtract
		(
			cylinder.center
		);

		if (displacementBetweenCenters.z < bounds.sizeHalf.z + cylinder.lengthHalf);
		{
			displacementBetweenCenters.clearZ();

			var direction = displacementBetweenCenters.normalize();

			var pointOnCylinderClosestToBoundsCenter = direction.multiplyScalar
			(
				cylinder.radius
			).add
			(
				cylinder.center
			);

			pointOnCylinderClosestToBoundsCenter.z = bounds.center.z;

			var isPointOnCylinderWithinBounds = bounds.containsPoint
			(
				pointOnCylinderClosestToBoundsCenter
			);

			returnValue = isPointOnCylinderWithinBounds;
		}

		return returnValue;
	};

	CollisionHelper.prototype.doBoundsAndHemispaceCollide = function(bounds, hemispace)
	{
		var returnValue = false;

		var vertices = Mesh.fromBounds(bounds).vertices();
		for (var i = 0; i < vertices.length; i++)
		{
			var vertex = vertices[v];
			if (hemispace.containsPoint(vertex) == true)
			{
				returnValue = true;
				break;
			}
		}
		return returnValue;
	};

	CollisionHelper.prototype.doBoundsAndSphereCollide = function(bounds, sphere)
	{
		// hack
		var sphereBounds = new Bounds
		(
			sphere.center, new Coords(1, 1, 1).multiplyScalar(sphere.radius)
		);

		return this.doBoundsAndBoundsCollide(bounds, sphereBounds);
	};

	CollisionHelper.prototype.doCylinderAndCylinderCollide = function(cylinder0, cylinder1)
	{
		var returnValue = false;

		var displacement = this.displacement.overwriteWith
		(
			cylinder1.center
		).subtract
		(
			cylinder0.center
		).clearZ();

		var distance = displacement.magnitude();
		var sumOfRadii = sphere0.radius + sphere1.radius;
		var doRadiiOverlap = (distance < sumOfRadii);
		if (doRadiiOverlap == true)
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

			if (doLengthsOverlap == true)
			{
				returnValue = true;
			}
		}

		return returnValue;
	};

	CollisionHelper.prototype.doEdgeAndFaceCollide = function(edge, face)
	{
		return (this.collisionOfEdgeAndFace(edge, face) != null);
	};

	CollisionHelper.prototype.doEdgeAndHemispaceCollide = function(edge, hemispace)
	{
		var vertices = edge.vertices;
		var returnValue = ( hemispace.containsPoint(vertices[0]) || hemispace.containsPoint(vertices[1]) );
		return returnValue;
	};

	CollisionHelper.prototype.doEdgeAndMeshCollide = function(edge, mesh)
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

	CollisionHelper.prototype.doEdgeAndPlaneCollide = function(edge, plane)
	{
		return (this.collisionOfEdgeAndPlane() != null);
	};

	CollisionHelper.prototype.doHemispaceAndSphereCollide = function(hemispace, sphere)
	{
		var plane = hemispace.plane;
		var distanceOfSphereCenterFromOriginAlongNormal =
			sphere.center.dotProduct(plane.normal);
		var distanceOfSphereCenterAbovePlane =
			distanceOfSphereCenterFromOriginAlongNormal
			- plane.distanceFromOrigin;
		var returnValue = (distanceOfSphereCenterAbovePlane < sphere.radius);
		return returnValue;
	};

	CollisionHelper.prototype.doMeshAndMeshCollide = function(mesh0, mesh1)
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

	CollisionHelper.prototype.doMapLocatedAndMapLocatedCollide = function(mapLocated0, mapLocated1)
	{
		var returnValue = false;

		var doBoundsCollide =
			this.doBoundsAndBoundsCollide(mapLocated0.bounds, mapLocated1.bounds);

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

				if (cell0.isBlocking == true)
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

							var isCell1PosInBounds = cell1PosInCells.isInRangeMinMax
							(
								Coords.Instances().Zeroes, map1SizeInCellsMinusOnes
							)
							if (isCell1PosInBounds == true)
							{
								cell1 = map1.cellAtPosInCells(map1, cell1PosInCells, cell1);

								if (cell1.isBlocking == true)
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

	CollisionHelper.prototype.doMapLocatedAndSphereCollide = function(mapLocated, sphere)
	{
		var returnValue = false;

		var doBoundsCollide =
			this.doBoundsAndSphereCollide(mapLocated.bounds, sphere);

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
		var cellAsBounds = new Bounds( new Coords(), map.cellSize );

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;
			cellPosAbsolute.y = (y * mapCellSize.y) + mapPos.y - mapSizeHalf.y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;
				cellPosAbsolute.x = (x * mapCellSize.x) + mapPos.x - mapSizeHalf.x;

				cell = map.cellAtPosInCells(map, cellPosInCells, cell);

				if (cell.isBlocking == true)
				{
					cellAsBounds.center.overwriteWith(cellPosAbsolute);
					var doCellAndSphereCollide = this.doBoundsAndSphereCollide(cellAsBounds, sphere);
					if (doCellAndSphereCollide == true)
					{
						returnValue = true;
						break;
					}
				}
			}
		}

		return returnValue;
	};

	CollisionHelper.prototype.doMeshAndSphereCollide = function(mesh, sphere)
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

	CollisionHelper.prototype.doSphereAndSphereCollide = function(sphere0, sphere1)
	{
		var displacement = this.displacement.overwriteWith
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

	CollisionHelper.prototype.doShapeGroupAllAndShapeCollide = function(groupAll, shapeOther)
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

	CollisionHelper.prototype.doShapeGroupAnyAndShapeCollide = function(groupAny, shapeOther)
	{
		var returnValue = false;

		var shapesThis = groupAny.shapes;
		for (var i = 0; i < shapesThis.length; i++)
		{
			var shapeThis = shapesThis[i];
			var doShapesCollide = this.doCollidersCollide(shapeThis, shapeOther);
			if (doShapesCollide == true)
			{
				returnValue = true;
				break;
			}
		}

		return returnValue;
	};

	CollisionHelper.prototype.doShapeContainerAndShapeCollide = function(container, shapeOther)
	{
		return this.doesColliderContainOther(container.shape, shapeOther);
	};

	CollisionHelper.prototype.doShapeInverseAndShapeCollide = function(inverse, shapeOther)
	{
		return (this.doCollidersCollide(inverse.shape, shapeOther) == false);
	};

	CollisionHelper.prototype.doBoundsAndShapeGroupAllCollide = function(shape, group)
	{
		return this.doShapeGroupAllAndShapeCollide(group, shape);
	};

	CollisionHelper.prototype.doShapeGroupAllAndSphereCollide = function(group, shape)
	{
		return this.doShapeGroupAllAndShapeCollide(group, shape);
	};

	CollisionHelper.prototype.doBoundsAndShapeGroupAnyCollide = function(shape, group)
	{
		return this.doShapeGroupAnyAndShapeCollide(group, shape);
	};

	CollisionHelper.prototype.doShapeContainerAndSphereCollide = function(container, sphere)
	{
		return this.doShapeContainerAndShapeCollide(container, sphere);
	};

	CollisionHelper.prototype.doShapeGroupAnyAndSphereCollide = function(group, shape)
	{
		return this.doShapeGroupAnyAndShapeCollide(group, shape);
	};

	CollisionHelper.prototype.doShapeInverseAndSphereCollide = function(inverse, shape)
	{
		return this.doShapeInverseAndShapeCollide(inverse, shape);
	};

	// contains

	CollisionHelper.prototype.doesBoundsContainBounds = function(bounds0, bounds1)
	{
		return bounds0.containsOther(bounds1);
	};

	CollisionHelper.prototype.doesBoundsContainHemispace = function(bounds, hemispace)
	{
		return false;
	};

	CollisionHelper.prototype.doesBoundsContainSphere = function(bounds, sphere)
	{
		var boundsForSphere = new Bounds
		(
			sphere.center, new Coords(1, 1, 1).multiplyScalar(sphere.radius * 2)
		);

		var returnValue = bounds.containsOther(boundsForSphere);

		return returnValue;
	};

	CollisionHelper.prototype.doesHemispaceContainBounds = function(hemispace, bounds)
	{
		var returnValue = true;

		var vertices = Mesh.fromBounds(bounds).vertices;
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

	CollisionHelper.prototype.doesHemispaceContainSphere = function(hemispace, sphere)
	{
		var plane = hemispace.plane;
		var distanceOfSphereCenterAbovePlane =
			sphere.center.dotProduct(plane.normal)
			- plane.distanceFromOrigin;
		var returnValue = (distanceOfSphereCenterAbovePlane >= sphere.radius);
		return returnValue;
	};

	CollisionHelper.prototype.doesSphereContainBounds = function(sphere, bounds)
	{
		var sphereCircumscribingBounds = new Sphere(bounds.center, bounds.max().magnitude());
		var returnValue = sphere.containsOther(sphereCircumscribingBounds);
		return returnValue;
	};

	CollisionHelper.prototype.doesSphereContainHemispace = function(sphere, hemispace)
	{
		return false;
	};

	CollisionHelper.prototype.doesSphereContainSphere = function(sphere0, sphere1)
	{
		return sphere0.containsOther(sphere1);
	};
}
