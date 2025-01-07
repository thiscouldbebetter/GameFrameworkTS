
namespace ThisCouldBeBetter.GameFramework
{

export class VisualJump2D implements Visual<VisualJump2D>
{
	visualJumper: VisualBase;
	visualShadow: VisualBase;
	cameraFactory: () => Camera;

	_posSaved: Coords;

	constructor
	(
		visualJumper: VisualBase,
		visualShadow: VisualBase,
		cameraFactory: () => Camera
	)
	{
		this.visualJumper = visualJumper;
		this.visualShadow = visualShadow;

		this._posSaved = Coords.create();
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualJump2D
	{
		transformToApply.transform(this.visualJumper);
		transformToApply.transform(this.visualShadow);
		return this;
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.visualJumper.initialize(uwpe);
		this.visualShadow.initialize(uwpe);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var world = uwpe.world;
		var entity = uwpe.entity;
		var entityPos = Locatable.of(entity).loc.pos;
		var entityPosZ = entityPos.z;
		var camera = Camera.of
		(
			Camera.entityFromPlace(world.placeCurrent)
		); // hack
		entityPosZ -= camera.focalLength;
		var height = 0 - entityPosZ;
		if (height <= 0)
		{
			this.visualJumper.draw(uwpe, display);
		}
		else
		{
			this.visualShadow.draw(uwpe, display);
			this._posSaved.overwriteWith(entityPos);
			entityPos.y -= height;
			this.visualJumper.draw(uwpe, display);
			entityPos.overwriteWith(this._posSaved);
		}
	}

	// Cloneable.

	clone(): VisualJump2D
	{
		return new VisualJump2D
		(
			this.visualJumper.clone(), this.visualShadow.clone(),
			this.cameraFactory
		);
	}

	overwriteWith(other: VisualJump2D): VisualJump2D
	{
		this.visualJumper.overwriteWith(other.visualJumper);
		this.visualShadow.overwriteWith(other.visualShadow);
		return this;
	}
}

}
