
class VisualRotate
{
	constructor(rotationInTurns, child)
	{
		this.rotationInTurns = rotationInTurns;
		this.child = child;
	}

	draw(universe, world, display, entity)
	{
		var graphics = display.graphics;
		graphics.save();

		var centerOfRotation = entity.locatable.loc.pos;
		graphics.translate(centerOfRotation.x, centerOfRotation.y);

		var rotationInRadians = this.rotationInTurns * Polar.RadiansPerTurn;
		graphics.rotate(rotationInRadians);

		graphics.translate(0 - centerOfRotation.x, 0 - centerOfRotation.y);

		this.child.draw(universe, world, display, entity);

		graphics.restore();
	};
}
