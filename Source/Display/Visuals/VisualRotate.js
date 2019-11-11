
function VisualRotate(rotationInTurns, child)
{
	this.rotationInTurns = rotationInTurns;
	this.child = child;
}

{
	VisualRotate.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var graphics = display.graphics;
		graphics.save();

		var centerOfRotation = entity.Locatable.loc.pos;
		graphics.translate(centerOfRotation.x, centerOfRotation.y);

		var rotationInRadians = this.rotationInTurns * Polar.RadiansPerTurn;
		graphics.rotate(rotationInRadians);

		graphics.translate(0 - centerOfRotation.x, 0 - centerOfRotation.y);
		
		this.child.draw(universe, world, display, drawable, entity);

		graphics.restore();
	};
}
