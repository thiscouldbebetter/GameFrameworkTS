
function VisualCamera(child, cameraFactory)
{
	this.child = child;
	this.cameraFactory = cameraFactory;

	// Helper variables.
	this.posSaved = new Coords();
}

{
	VisualCamera.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var drawablePos = drawable.loc.pos;
		this.posSaved.overwriteWith(drawablePos);
		this.cameraFactory(universe, world).coordsTransformWorldToView(drawablePos);
		this.child.draw(universe, world, display, drawable, entity);
		drawablePos.overwriteWith(this.posSaved);
	};
}
