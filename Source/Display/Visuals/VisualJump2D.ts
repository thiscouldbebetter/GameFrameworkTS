
namespace ThisCouldBeBetter.GameFramework
{

export class VisualJump2D implements Visual
{
	visualJumper: Visual;
	visualShadow: Visual;
	cameraFactory: () => Camera;

	_posSaved: Coords;

	constructor(visualJumper: Visual, visualShadow: Visual, cameraFactory: () => Camera)
	{
		this.visualJumper = visualJumper;
		this.visualShadow = visualShadow;

		this._posSaved = Coords.blank();
	}

	// Transformable.

	transform(transformToApply: Transform)
	{
		transformToApply.transform(this.visualJumper);
		transformToApply.transform(this.visualShadow);
		return this;
	}

	// Visual.

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var entityPos = entity.locatable().loc.pos;
		var entityPosZ = entityPos.z;
		var camera = world.placeCurrent.camera(); // hack
		entityPosZ -= camera.focalLength;
		var height = 0 - entityPosZ;
		if (height <= 0)
		{
			this.visualJumper.draw(universe, world, place, entity, display);
		}
		else
		{
			this.visualShadow.draw(universe, world, place, entity, display);
			this._posSaved.overwriteWith(entityPos);
			entityPos.y -= height;
			this.visualJumper.draw(universe, world, place, entity, display);
			entityPos.overwriteWith(this._posSaved);
		}
	}

	// Cloneable.

	clone(): Visual
	{
		return new VisualJump2D
		(
			this.visualJumper.clone(), this.visualShadow.clone(), this.cameraFactory
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
