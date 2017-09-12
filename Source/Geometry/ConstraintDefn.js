
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
			function constrain(context, constrainable, target)
			{
				// Do nothing.
			}
		)
		
		this.Attach = new ConstraintDefn
		(
			"Attach",
			function constrain(context, constrainable, targetBodyName)
			{
				var target = context.bodies[targetBodyName];
				constrainable.loc.pos.overwriteWith(target.loc.pos);
			}
		);
		
		this.ContainInBounds = new ConstraintDefn
		(
			"ContainInBounds",
			function constrain(context, constrainable, targetBodyName)
			{
				var target = context.bodies[targetBodyName];
				var targetBounds = target.collider().bounds();

				targetBounds.trimCoords(constrainable.loc.pos);
			}
		);
		
		this.Offset = new ConstraintDefn
		(
			"Offset",
			function constrain(context, constrainable, targetOffset)
			{
				constrainable.loc.pos.add(targetOffset);
			}
		);

		this.OrientToward = new ConstraintDefn
		(
			"OrientToward",
			function constrain(context, constrainable, targetBodyName)
			{
				var constrainableLoc = constrainable.loc;
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