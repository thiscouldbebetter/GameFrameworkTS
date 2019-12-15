
function VisualCamera(child, cameraFactory)
{
	this.child = child;
	this.cameraFactory = cameraFactory;

	// Helper variables.
	this._posSaved = new Coords();
}

{
	VisualCamera.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var drawablePos = entity.Locatable.loc.pos;
		this._posSaved.overwriteWith(drawablePos);
		var camera = this.cameraFactory(universe, world);
		camera.coordsTransformWorldToView(drawablePos);
		this.child.draw(universe, world, display, drawable, entity);
		drawablePos.overwriteWith(this._posSaved);
	};
}
