
function VisualJump2D(visualJumper, visualShadow, cameraFactory)
{
	this.visualJumper = visualJumper;
	this.visualShadow = visualShadow;

	this._posSaved = new Coords();
}

{
	// Cloneable.

	VisualJump2D.prototype.clone = function()
	{
		return new VisualJump2D
		(
			this.visualJumper.clone(), this.visualShadow.clone()
		);
	};

	VisualJump2D.prototype.overwriteWith = function(other)
	{
		this.visualJumper.overwriteWith(other.visualJumper);
		this.visualShadow.overwriteWith(other.visualShadow);
	};

	// Transformable.

	VisualJump2D.prototype.transform = function(transformToApply)
	{
		transformToApply.transform(this.visualJumper);
		transformToApply.transform(this.visualShadow);
		return this;
	};

	// Visual.

	VisualJump2D.prototype.draw = function(universe, world, display, entity)
	{
		var entityPos = entity.locatable.loc.pos;
		var entityPosZ = entityPos.z;
		var camera = world.placeCurrent.camera(); // hack
		entityPosZ -= camera.focalLength;
		var height = 0 - entityPosZ;
		if (height <= 0)
		{
			this.visualJumper.draw(universe, world, display, entity);
		}
		else
		{
			this.visualShadow.draw(universe, world, display, entity);
			this._posSaved.overwriteWith(entityPos);
			entityPos.y -= height;
			this.visualJumper.draw(universe, world, display, entity);
			entityPos.overwriteWith(this._posSaved);
		}
	};
}