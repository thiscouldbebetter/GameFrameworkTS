
class VisualCameraProjection implements Visual
{
	child: Visual;
	cameraFactory: (u: Universe, w: World) => Camera;

	_posSaved: Coords;

	constructor(child: Visual, cameraFactory: (u: Universe, w: World) => Camera)
	{
		this.child = child;
		this.cameraFactory = cameraFactory;

		// Helper variables.
		this._posSaved = new Coords(0, 0, 0);
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var drawablePos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawablePos);

		var camera = this.cameraFactory(universe, world);
		camera.coordsTransformWorldToView(drawablePos);

		var isEntityInView = false;
		var boundable = entity.boundable();
		if (boundable == null) // todo
		{
			isEntityInView = true;
		}
		else
		{
			var drawableCollider = boundable.bounds;
			var cameraViewCollider = camera.viewCollider;
			var collisionHelper = universe.collisionHelper;
			isEntityInView = collisionHelper.doCollidersCollide
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

	drawImmediate(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var drawablePos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawablePos);

		var camera = this.cameraFactory(universe, world);
		camera.coordsTransformWorldToView(drawablePos);

		this.child.draw(universe, world, place, entity, display);

		drawablePos.overwriteWith(this._posSaved);
	};

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}
