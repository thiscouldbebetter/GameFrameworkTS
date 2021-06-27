
namespace ThisCouldBeBetter.GameFramework
{

export class VisualJump2D implements Visual
{
	visualJumper: Visual;
	visualShadow: Visual;
	cameraFactory: () => Camera;

	_posSaved: Coords;

	constructor
	(
		visualJumper: Visual, visualShadow: Visual,
		cameraFactory: () => Camera
	)
	{
		this.visualJumper = visualJumper;
		this.visualShadow = visualShadow;

		this._posSaved = Coords.create();
	}

	// Transformable.

	transform(transformToApply: Transform): VisualJump2D
	{
		transformToApply.transform(this.visualJumper);
		transformToApply.transform(this.visualShadow);
		return this;
	}

	// Visual.

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var world = uwpe.world;
		var entity = uwpe.entity;
		var entityPos = entity.locatable().loc.pos;
		var entityPosZ = entityPos.z;
		var camera = world.placeCurrent.camera().camera(); // hack
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

	clone(): Visual
	{
		return new VisualJump2D
		(
			this.visualJumper.clone(), this.visualShadow.clone(),
			this.cameraFactory
		);
	}

	overwriteWith(other: VisualJump2D): Visual
	{
		this.visualJumper.overwriteWith(other.visualJumper);
		this.visualShadow.overwriteWith(other.visualShadow);
		return this;
	}
}

}
