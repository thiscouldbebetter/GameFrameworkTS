
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
			function constrain(universe, world, place, entity, target)
			{
				// Do nothing.
			}
		)

		this.Attach = new ConstraintDefn
		(
			"Attach",
			function constrain(universe, world, place, entity, targetBodyName)
			{
				var target = context.bodies[targetBodyName];
				entity.loc.pos.overwriteWith(target.loc.pos);
			}
		);

		this.ContainInBounds = new ConstraintDefn
		(
			"ContainInBounds",
			function constrain(universe, world, place, entity, targetBodyName)
			{
				var target = context.bodies[targetBodyName];
				var targetBounds = target.collider().bounds(world);

				targetBounds.trimCoords(entity.loc.pos);
			}
		);

		this.Offset = new ConstraintDefn
		(
			"Offset",
			function constrain(universe, world, place, entity, targetOffset)
			{
				entity.loc.pos.add(targetOffset);
			}
		);

		this.OrientToward = new ConstraintDefn
		(
			"OrientToward",
			function constrain(universe, world, place, entity, targetBodyName)
			{
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
	}
}
