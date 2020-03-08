
function ConstraintInstances()
{
	// Instance class.
}

{
	function Constraint_None()
	{
		// Do nothing.
	}
	{
		Constraint_None.prototype.constrain = function(universe, world, place, entity)
		{
			// Do nothing.
		};
	}

	function Constraint_AttachToEntityWithName(target)
	{
		this.target = target;
	}
	{
		Constraint_AttachToEntityWithName.prototype.constrain = function
		(
			universe, world, place, entityToConstrain, constraint
		)
		{
			var targetEntityName = this.target;
			var targetEntity = place.entities[targetEntityName];
			if (targetEntity != null)
			{
				var targetPos = targetEntity.locatable.loc.pos;
				entityToConstrain.locatable.loc.pos.overwriteWith(targetPos);
			}
		};
	}

	function Constraint_Conditional(shouldChildApply, child)
	{
		this.shouldChildApply = shouldChildApply;
		this.child = child;
	}
	{
		Constraint_Conditional.prototype.constrain = function(universe, world, place, entity)
		{
			var willChildApply = this.shouldChildApply(universe, world, place, entity);
			if (willChildApply)
			{
				this.child.constrain(universe, world, place, entity);
			}
		};
	}

	function Constraint_ContainInBox(boxToContainWithin)
	{
		this.boxToContainWithin = boxToContainWithin;
	}
	{
		Constraint_ContainInBox.prototype.constrain = function(universe, world, place, entity)
		{
			this.boxToContainWithin.trimCoords(entity.locatable.loc.pos);
		};
	}

	function Constraint_ContainInHemispace(hemispaceToContainWithin)
	{
		this.hemispaceToContainWithin = hemispaceToContainWithin;

		this._coordsTemp = new Coords();
	}
	{
		Constraint_ContainInHemispace.prototype.constrain = function(universe, world, place, entity)
		{
			var hemispace = this.hemispaceToContainWithin;
			var plane = hemispace.plane;
			var loc = entity.locatable.loc;
			var pos = loc.pos;

			// Can't use Hemispace.trimCoords(),
			// because we also need to trim velocity and acceleration.
			var distanceOfPointAbovePlane =
				plane.distanceToPointAlongNormal(pos);
			var areCoordsOutsideHemispace = (distanceOfPointAbovePlane > 0);
			if (areCoordsOutsideHemispace)
			{
				var planeNormal = plane.normal;
				pos.subtract
				(
					this._coordsTemp.overwriteWith
					(
						planeNormal
					).multiplyScalar
					(
						distanceOfPointAbovePlane
					)
				);

				var vel = loc.vel;
				var speedAlongNormal = vel.dotProduct(planeNormal);
				if (speedAlongNormal > 0)
				{
					vel.subtract
					(
						this._coordsTemp.overwriteWith
						(
							planeNormal
						).multiplyScalar
						(
							speedAlongNormal
						)
					);
				}

				var accel = loc.accel;
				var accelerationAlongNormal = accel.dotProduct(planeNormal);
				if (accelerationAlongNormal > 0)
				{
					accel.subtract
					(
						this._coordsTemp.overwriteWith
						(
							planeNormal
						).multiplyScalar
						(
							accelerationAlongNormal
						)
					);
				}
			}
		};
	}

	function Constraint_FrictionXY(target)
	{
		this.target = target;
	}
	{
		Constraint_FrictionXY.prototype.constrain = function(universe, world, place, entity)
		{
			var targetFrictionCoefficient = this.target;
			var entityLoc = entity.locatable.loc;
			var entityVel = entityLoc.vel;
			var entityVelZSaved = entityVel.z;
			entityVel.z = 0;
			var speed = entityVel.magnitude();
			var frictionMagnitude = speed * targetFrictionCoefficient;
			entityVel.add
			(
				entityVel.clone().multiplyScalar(-frictionMagnitude)
			);
			entityVel.z = entityVelZSaved;
		};
	}

	function Constraint_FrictionDry(target)
	{
		this.target = target;
	}
	{
		Constraint_FrictionDry.prototype.constrain = function(universe, world, place, entity)
		{
			var targetFrictionCoefficient = this.target;
			var frictionMagnitude = targetFrictionCoefficient;
			var entityLoc = entity.locatable.loc;
			var entityVel = entityLoc.vel;
			var entitySpeed = entityVel.magnitude();
			if (entitySpeed <= frictionMagnitude)
			{
				entityVel.clear();
			}
			else
			{
				var entityDirection = entityVel.clone().normalize();
				entityVel.add
				(
					entityDirection.multiplyScalar(-frictionMagnitude)
				);
			}
		};
	}

	function Constraint_Gravity(accelerationPerTick)
	{
		this.accelerationPerTick = accelerationPerTick;
	}
	{
		Constraint_Gravity.prototype.constrain = function(universe, world, place, entity)
		{
			var loc = entity.locatable.loc;
			if (loc.pos.z < 0) // hack
			{
				loc.accel.add(this.accelerationPerTick);
			}
		}
	}

	function Constraint_Offset(target)
	{
		this.target = target;
	}
	{
		Constraint_Offset.prototype.constrain = function(universe, world, place, entity)
		{
			var targetOffset = this.target;
			entity.loc.pos.add(targetOffset);
		};
	}

	function Constraint_OrientToward(target)
	{
		this.target = target;
	}
	{
		Constraint_OrientToward.prototype.constrain = function(universe, world, place, entity)
		{
			var targetBodyName = this.target;

			var constrainableLoc = entity.loc;
			var constrainablePos = constrainableLoc.pos;
			var constrainableOrientation = constrainableLoc.orientation;
			var constrainableForward = constrainableOrientation.forward;

			var target = context.bodies[targetBodyName];
			var targetPos = target.loc.pos;

			constrainableForward.overwriteWith
			(
				targetPos
			).subtract
			(
				constrainablePos
			).normalize();

			constrainableOrientation.forwardSet(constrainableForward);
		};
	}

	function Constraint_SpeedMaxXY(target)
	{
		this.target = target;
	}
	{
		Constraint_SpeedMaxXY.prototype.constrain = function(universe, world, place, entity)
		{
			var targetSpeedMax = this.target;
			var entityLoc = entity.locatable.loc;
			var entityVel = entityLoc.vel;
			var zSaved = entityVel.z;
			entityVel.z = 0;
			var speed = entityVel.magnitude();
			if (speed > targetSpeedMax)
			{
				entityVel.normalize().multiplyScalar(targetSpeedMax);
			}
			entityVel.z = zSaved;
		};
	}

	function Constraint_StopBelowSpeedMin(target)
	{
		this.target = target;
	}
	{
		Constraint_StopBelowSpeedMin.prototype.constrain = function(universe, world, place, entity)
		{
			var targetSpeedMin = this.target;
			var entityLoc = entity.locatable.loc;
			var entityVel = entityLoc.vel;
			var speed = entityVel.magnitude();
			if (speed < targetSpeedMin)
			{
				entityVel.clear();
			}
		};
	}

	function Constraint_TrimToRange(target)
	{
		this.target = target;
	}
	{
		Constraint_TrimToRange.prototype.constrain = function(universe, world, place, entity)
		{
			var targetSize = this.target;
			var entityLoc = entity.locatable.loc;
			entityLoc.pos.trimToRangeMax(targetSize);
		};
	}

	function Constraint_WrapToRange(target)
	{
		this.target = target;
	}
	{
		Constraint_WrapToRange.prototype.constrain = function(universe, world, place, entity)
		{
			var targetRange = this.target;
			var entityLoc = entity.locatable.loc;
			entityLoc.pos.wrapToRangeMax(targetRange);
		};
	}

	function Constraint_WrapXTrimY(target)
	{
		this.target = target;
	}
	{
		Constraint_WrapXTrimY.prototype.constrain = function(universe, world, place, entity)
		{
			var entityLoc = entity.locatable.loc;
			var entityPos = entityLoc.pos;
			var max = this.target;

			while (entityPos.x < 0)
			{
				entityPos.x += max.x;
			}
			while (entityPos.x >= max.x)
			{
				entityPos.x -= max.x;
			}

			if (entityPos.y < 0)
			{
				entityPos.y = 0;
			}
			else if (entityPos.y > max.y)
			{
				entityPos.y = max.y;
			}
		};
	}
}
