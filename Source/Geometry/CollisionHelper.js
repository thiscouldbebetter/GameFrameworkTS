
function CollisionHelper()
{
	// helper variables
	this.tempCoords = new Coords();
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
						[collidableFromSet0, collidableFromSet1]
					);
					returnValues.push(collision);
				}
			}
		}

		return returnValues;
	}

	CollisionHelper.prototype.doCollidablesCollide = function(collidable0, collidable1)
	{
		var collider0 = collidable0.collider();
		var collider1 = collidable1.collider();

		var doCollidersCollide = this.doCollidersCollide(collider0, collider1);

		return doCollidersCollide;
	}

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
			throw "Error - No collision method in CollisionHelper named " + collisionMethodName;
		}
		else
		{
			returnValue = collisionMethod.call(this, collidersAlphabetized[0], collidersAlphabetized[1]);
		}

		return returnValue;
	}
	
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
	}

	// shapes

	// collisions

	CollisionHelper.prototype.doBoundsAndBoundsCollide = function(bounds0, bounds1)
	{
		var returnValue = bounds0.overlapsWith(bounds1);
		return returnValue;
	}
	
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
	}
	
	CollisionHelper.prototype.doBoundsAndSphereCollide = function(bounds, sphere)
	{
		var displacementBetweenCenters = this.tempCoords.overwriteWith
		(
			bounds.center
		).subtract
		(
			sphere.center
		);

		var direction = displacementBetweenCenters.normalize();

		var pointOnSphereClosestToBoundsCenter = direction.multiplyScalar
		(
			sphere.radius
		).add
		(
			sphere.center
		);

		var isPointOnSphereWithinBounds = bounds.containsPoint
		(
			pointOnSphereClosestToBoundsCenter
		);

		return isPointOnSphereWithinBounds;
	}

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
	}

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
				var faceNormal = face.plane.normal;

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

	CollisionHelper.prototype.doMeshAndSphereCollide = function(mesh, sphere)
	{
		var returnValue = true;

		// hack - Mesh is assumed to be convex.

		var meshFaces = mesh.faces();
		var hemispace = new Hemispace();

		for (var f = 0; f < meshFaces.length; f++)
		{
			var face = meshFaces[f];
			hemispace.plane = face.plane;
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


	CollisionHelper.prototype.doSphereAndSphereCollide = function(sphere0, sphere1)
	{
		var displacement = sphere1.center.clone().subtract(sphere0.center);
		var distance = displacement.magnitude();
		var sumOfRadii = sphere0.radius + sphere1.radius;
		var returnValue = (distance < sumOfRadii);

		return returnValue;
	}

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
	}
	
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
	}
	
	CollisionHelper.prototype.doShapeContainerAndShapeCollide = function(container, shapeOther)
	{
		return this.doesColliderContainOther(container.shape, shapeOther);
	}
	
	CollisionHelper.prototype.doShapeInverseAndShapeCollide = function(inverse, shapeOther)
	{
		return (this.doCollidersCollide(inverse.shape, shapeOther) == false);
	}
	
	CollisionHelper.prototype.doBoundsAndShapeGroupAllCollide = function(shape, group)
	{
		return this.doShapeGroupAllAndShapeCollide(group, shape);
	}

	CollisionHelper.prototype.doShapeGroupAllAndSphereCollide = function(group, shape)
	{
		return this.doShapeGroupAllAndShapeCollide(group, shape);
	}

	CollisionHelper.prototype.doBoundsAndShapeGroupAnyCollide = function(shape, group)
	{
		return this.doShapeGroupAnyAndShapeCollide(group, shape);
	}

	CollisionHelper.prototype.doShapeContainerAndSphereCollide = function(container, sphere)
	{
		return this.doShapeContainerAndShapeCollide(container, sphere);
	}

	CollisionHelper.prototype.doShapeGroupAnyAndSphereCollide = function(group, shape)
	{
		return this.doShapeGroupAnyAndShapeCollide(group, shape);
	}

	CollisionHelper.prototype.doShapeInverseAndSphereCollide = function(inverse, shape)
	{
		return this.doShapeInverseAndShapeCollide(inverse, shape);
	}

	// contains
	
	CollisionHelper.prototype.doesBoundsContainBounds = function(bounds0, bounds1)
	{
		return bounds0.containsOther(bounds1);
	}
	
	CollisionHelper.prototype.doesBoundsContainHemispace = function(bounds, hemispace)
	{
		return false;
	}
	
	CollisionHelper.prototype.doesBoundsContainSphere = function(bounds, sphere)
	{
		var boundsForSphere = new Bounds
		(
			sphere.center, new Coords(1, 1, 1).multiplyScalar(sphere.radius * 2) 
		);
		
		var returnValue = bounds.containsOther(boundsForSphere);
		
		return returnValue;
	}
	
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
	}

	CollisionHelper.prototype.doesHemispaceContainSphere = function(hemispace, sphere)
	{
		var plane = hemispace.plane;
		var distanceOfSphereCenterAbovePlane = 
			sphere.center.dotProduct(plane.normal) 
			- plane.distanceFromOrigin;
		var returnValue = (distanceOfSphereCenterAbovePlane >= sphere.radius);
		return returnValue;
	}

	CollisionHelper.prototype.doesSphereContainBounds = function(sphere, bounds)
	{
		var sphereCircumscribingBounds = new Sphere(bounds.center, bounds.max().magnitude());
		var returnValue = sphere.containsOther(sphereCircumscribingBounds);
		return returnValue;
	}
	
	CollisionHelper.prototype.doesSphereContainHemispace = function(sphere, hemispace)
	{
		return false;
	}
	
	CollisionHelper.prototype.doesSphereContainSphere = function(sphere0, sphere1)
	{
		return sphere0.containsOther(sphere1);
	}

}
