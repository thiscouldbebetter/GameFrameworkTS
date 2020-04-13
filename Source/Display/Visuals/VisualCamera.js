
class VisualCamera
{
	constructor(child, cameraFactory)
	{
		this.child = child;
		this.cameraFactory = cameraFactory;

		// Helper variables.
		this._posSaved = new Coords();
	}

	draw(universe, world, display, entity)
	{
		var drawablePos = entity.locatable.loc.pos;
		this._posSaved.overwriteWith(drawablePos);

		var camera = this.cameraFactory(universe, world);
		camera.coordsTransformWorldToView(drawablePos);

		if (entity.Boundable == null) // todo
		{
			this.child.draw(universe, world, display, entity);
		}
		else
		{
			var drawableCollider = entity.Boundable.bounds;
			var cameraViewCollider = camera.viewCollider;
			var isInCameraBox =
				universe.collisionHelper.doCollidersCollide(drawableCollider, cameraViewCollider);
			if (isInCameraBox)
			{
				this.child.draw(universe, world, display, entity);
			}
		}

		drawablePos.overwriteWith(this._posSaved);
	};
}
