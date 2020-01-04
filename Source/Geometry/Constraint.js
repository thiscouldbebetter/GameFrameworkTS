
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
		}
	}

	function Constraint_AttachToEntityWithName(target)
	{
		this.target = target;
	}
	{
		Constraint_AttachToEntityWithName.prototype.constrain = function(universe, world, place, entityToConstrain, constraint)
		{
			var targetEntityName = this.target;
			var targetEntity = place.entities[targetEntityName];
			entityToConstrain.Locatable.loc.pos.overwriteWith(targetEntity.Locatable.loc.pos);
		}
	}

	function Constraint_ContainInBox(target)
	{
		this.target = target;
	}
	{
		Constraint_ContainInBox.prototype.constrain = function(universe, world, place, entityToConstrain, constraint)
		{
			var targetBox = this.target;
			targetBox.trimCoords(entityToConstrain.Locatable.loc.pos);
		}
	}

	function Constraint_Friction(target)
	{
		this.target = target;
	}
	{
		Constraint_Friction.prototype.constrain = function(universe, world, place, entity)
		{
			var targetFrictionCoefficient = this.target;
			var entityLoc = entity.Locatable.loc;
			var entityVel = entityLoc.vel;
			var speed = entityVel.magnitude();
			var frictionMagnitude = speed * targetFrictionCoefficient;
			entityVel.add
			(
				entityVel.clone().multiplyScalar(-frictionMagnitude)
			);
		}
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
			var entityLoc = entity.Locatable.loc;
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
		}
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
		}
	}

	function Constraint_SpeedMax(target)
	{
		this.target = target;
	}
	{
		Constraint_SpeedMax.prototype.constrain = function(universe, world, place, entity)
		{
			var targetSpeedMax = this.target;
			var entityLoc = entity.Locatable.loc;
			var entityVel = entityLoc.vel;
			var speed = entityVel.magnitude();
			if (speed > targetSpeedMax)
			{
				entityVel.normalize().multiplyScalar(targetSpeedMax);
			}
		}
	}

	function Constraint_StopBelowSpeedMin(target)
	{
		this.target = target;
	}
	{
		Constraint_StopBelowSpeedMin.prototype.constrain = function(universe, world, place, entity)
		{
			var targetSpeedMin = this.target;
			var entityLoc = entity.Locatable.loc;
			var entityVel = entityLoc.vel;
			var speed = entityVel.magnitude();
			if (speed < targetSpeedMin)
			{
				entityVel.clear();
			}
		}
	}

	function Constraint_TrimToRange(target)
	{
		this.target = target;
	}
	{
		Constraint_TrimToRange.prototype.constrain = function(universe, world, place, entity)
		{
			var targetSize = this.target;
			var entityLoc = entity.Locatable.loc;
			entityLoc.pos.trimToRangeMax(targetSize);
		}
	}

	function Constraint_WrapToRange(target)
	{
		this.target = target;
	}
	{
		Constraint_WrapToRange.prototype.constrain = function(universe, world, place, entity)
		{
			var targetRange = this.target;
			var entityLoc = entity.Locatable.loc;
			entityLoc.pos.wrapToRangeMax(targetRange);
		}
	}

	function Constraint_WrapXTrimY(target)
	{
		this.target = target;
	}
	{
		Constraint_WrapXTrimY.prototype.constrain = function(universe, world, place, entity)
		{
			var entityLoc = entity.Locatable.loc;
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
		}
	}
}
