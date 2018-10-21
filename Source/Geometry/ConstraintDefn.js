
function ConstraintDefn(name, constrain)
{
	this.name = name;
	this.constrain = constrain;
}

{
	ConstraintDefn.Instances = new ConstraintDefn_Instances();

	function ConstraintDefn_Instances()
	{
		this._None = new ConstraintDefn
		(
			"None",
			function constrain(universe, world, place, entity, constraint)
			{
				// Do nothing.
			}
		)

		this.Attach = new ConstraintDefn
		(
			"Attach",
			function constrain(universe, world, place, entity, constraint)
			{
				var targetBodyName = constraint.target;
				var target = context.bodies[targetBodyName];
				entity.loc.pos.overwriteWith(target.loc.pos);
			}
		);

		this.ContainInBounds = new ConstraintDefn
		(
			"ContainInBounds",
			function constrain(universe, world, place, entity, constraint)
			{
				var targetBodyName = constraint.target;
				var target = context.bodies[targetBodyName];
				var targetBounds = target.collider().bounds(world);

				targetBounds.trimCoords(entity.loc.pos);
			}
		);

		this.Friction = new ConstraintDefn
		(
			"Friction",
			function constrain(universe, world, place, entity, constraint)
			{
				var targetFrictionCoefficient = constraint.target;
				var entityLoc = entity.locatable.loc;
				var entityVel = entityLoc.vel;
				var speed = entityVel.magnitude();
				var frictionMagnitude = speed * targetFrictionCoefficient;
				entityVel.add
				(
					entityVel.clone().multiplyScalar(-frictionMagnitude)
				);
			}
		);

		this.FrictionDry = new ConstraintDefn
		(
			"FrictionDry",
			function constrain(universe, world, place, entity, constraint)
			{
				var targetFrictionCoefficient = constraint.target;
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
			}
		);

		this.Offset = new ConstraintDefn
		(
			"Offset",
			function constrain(universe, world, place, entity, constraint)
			{
				var targetOffset = constraint.target;
				entity.loc.pos.add(targetOffset);
			}
		);

		this.OrientToward = new ConstraintDefn
		(
			"OrientToward",
			function constrain(universe, world, place, entity, constraint)
			{
				var targetBodyName = constraint.target;

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
		);

		this.SpeedMax = new ConstraintDefn
		(
			"SpeedMax",
			function constrain(universe, world, place, entity, constraint)
			{
				var targetSpeedMax = constraint.target;
				var entityLoc = entity.locatable.loc;
				var entityVel = entityLoc.vel;
				var speed = entityVel.magnitude();
				if (speed > targetSpeedMax)
				{
					entityVel.normalize().multiplyScalar(targetSpeedMax);
				}
			}
		);

		this.StopBelowSpeedMin = new ConstraintDefn
		(
			"StopBelowSpeedMin",
			function constrain(universe, world, place, entity, constraint)
			{
				var targetSpeedMin = constraint.target;
				var entityLoc = entity.locatable.loc;
				var entityVel = entityLoc.vel;
				var speed = entityVel.magnitude();
				if (speed < targetSpeedMin)
				{
					entityVel.clear();
				}
			}
		);

		this.TrimToRange = new ConstraintDefn
		(
			"TrimToRange",
			function constrain(universe, world, place, entity, constraint)
			{
				var targetSize = constraint.target;
				var entityLoc = entity.locatable.loc;
				entityLoc.pos.trimToRangeMax(targetSize);
			}
		);

		this.WrapToRange = new ConstraintDefn
		(
			"WrapToRange",
			function constrain(universe, world, place, entity, constraint)
			{
				var targetRange = constraint.target;
				var entityLoc = entity.locatable.loc;
				entityLoc.pos.wrapToRangeMax(targetRange);
			}
		);

		this.WrapXTrimY = new ConstraintDefn
		(
			"WrapXTrimY",
			function constrain(universe, world, place, entity, constraint)
			{
				var entityLoc = entity.locatable.loc;
				var entityPos = entityLoc.pos;
				var max = constraint.target;

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
		);
	}
}
