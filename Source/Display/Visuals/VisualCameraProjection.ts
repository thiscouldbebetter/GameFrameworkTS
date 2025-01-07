
namespace ThisCouldBeBetter.GameFramework
{

export class VisualCameraProjection implements Visual<VisualCameraProjection>
{
	cameraGet: (uwpe: UniverseWorldPlaceEntities) => Camera;
	child: VisualBase;

	_cameraCached: Camera;
	_posBeforeProjection: Coords;
	_transformCamera: Transform_Camera;

	constructor
	(
		cameraGet: (uwpe: UniverseWorldPlaceEntities) => Camera,
		child: VisualBase
	)
	{
		this.cameraGet = cameraGet;
		this.child = child;

		this._posBeforeProjection = Coords.create();
	}

	reset()
	{
		this._transformCamera = null;
	}

	transformCamera(uwpe: UniverseWorldPlaceEntities): Transform_Camera
	{
		var camera = this.cameraGet(uwpe);
		if (camera != this._cameraCached)
		{
			this._cameraCached = camera;
			this._transformCamera = new Transform_Camera(camera);
		}
		return this._transformCamera;
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.child.initialize(uwpe);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		var entityPos = Locatable.of(entity).loc.pos;
		var posBeforeProjection = this._posBeforeProjection.overwriteWith(entityPos);
		var transform = this.transformCamera(uwpe);
		transform.transformCoords(entityPos);
		this.child.draw(uwpe, display);
		entityPos.overwriteWith(posBeforeProjection);
	}

	// Clonable.

	clone(): VisualCameraProjection
	{
		return this; // todo
	}

	overwriteWith(other: VisualCameraProjection): VisualCameraProjection
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualCameraProjection
	{
		return this; // todo
	}
}

}
