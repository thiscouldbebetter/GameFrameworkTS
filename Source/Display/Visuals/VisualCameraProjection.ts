
class VisualCameraProjection
{
	child: any;
	cameraFactory: any;

	_posSaved: Coords;

	constructor(child, cameraFactory)
	{
		this.child = child;
		this.cameraFactory = cameraFactory;

		// Helper variables.
		this._posSaved = new Coords(0, 0, 0);
	}

	draw(universe, world, display, entity)
	{
		var drawablePos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawablePos);

		var camera = this.cameraFactory(universe, world);
		camera.coordsTransformWorldToView(drawablePos);

		var isEntityInView = false;
		if (entity.Boundable == null) // todo
		{
			isEntityInView = true;
		}
		else
		{
			var drawableCollider = entity.Boundable.bounds;
			var cameraViewCollider = camera.viewCollider;
			isEntityInView = universe.collisionHelper.doCollidersCollide
			(
				drawableCollider, cameraViewCollider
			);
		}

		if (isEntityInView)
		{
			camera.entitiesInView.push(entity);
		}

		drawablePos.overwriteWith(this._posSaved);
	};

	drawImmediate(universe, world, display, entity)
	{
		var drawablePos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawablePos);

		var camera = this.cameraFactory(universe, world);
		camera.coordsTransformWorldToView(drawablePos);

		this.child.draw(universe, world, display, entity);

		drawablePos.overwriteWith(this._posSaved);
	};
}
