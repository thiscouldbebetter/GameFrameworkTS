
function VisualCamera(child, camera)
{
	this.child = child;
	this.camera = camera;

	// Helper variables.
	this.posSaved = new Coords();
}

{
	VisualCamera.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var drawablePos = drawable.loc.pos;
		this.posSaved.overwriteWith(drawablePos);
		this.camera.coordsTransformWorldToView(drawablePos);
		this.child.draw(universe, world, display, drawable, entity);
		drawablePos.overwriteWith(this.posSaved);
	};
}
