
function CollisionHelper()
{
	this.colliderTypeNameToCollisionMethodLookup = 
	{
		"Bounds_Bounds" : this.doBoundsCollide.bind(this),
		"Bounds_Sphere" : this.doesBoundsCollideWithSphere.bind(this),
		"Sphere_Sphere" : this.doSpheresCollide.bind(this)
	};
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
		
		colliderTypeNamesConcatenated = 
			collidersAlphabetized[0].constructor.name 
			+ "_" 
			+ collidersAlphabetized[1].constructor.name;
		var collisionMethod = this.colliderTypeNameToCollisionMethodLookup[colliderTypeNamesConcatenated];
		var returnValue = collisionMethod(collidersAlphabetized[0], collidersAlphabetized[1]);

		return returnValue;
	}

	// colliders
	
	CollisionHelper.prototype.doBoundsCollide = function(bounds0, bounds1)
	{
		var returnValue = bounds0.overlapsWith(bounds1);
		return returnValue;
	}

	CollisionHelper.prototype.doSpheresCollide = function(sphere0, sphere1)
	{
		var displacement = sphere1.center.clone().subtract(sphere0.center);
		var distance = displacement.magnitude();
		var sumOfRadii = sphere0.radius + sphere1.radius;
		var returnValue = (distance < sumOfRadii);
	
		return returnValue;
	}
	
	CollisionHelper.prototype.doesBoundsCollideWithSphere = function(bounds, sphere)
	{
		// fix
		
		var returnValue = false;
		
		var faces = bounds.faces();
		var sphereCenter = sphere.center;
		var sphereRadius = sphere.radius;
		for (var i = 0; i < faces.length; i++)
		{
			var face = faces[i];
			var facePlane = face.plane;
			var distanceOfSphereCenterAboveFace = 
				sphereCenter.dotProduct(facePlane.normal) 
				- facePlane.distanceFromOrigin;
			
			if (distanceOfSphereCenterAboveFace < sphereRadius)
			{
				var pointOnPlaneClosestToSphere = facePlane.normal.clone().multiplyScalar
				(
					distanceOfSphereCenterAboveFace
				).invert().add
				(
					sphereCenter
				);
				
				if (face.containsPoint(pointOnPlaneClosestToSphere) == true)
				{
					returnValue = true;
					break;
				}
				
			}
		}
		
		return returnValue;
	}
}
