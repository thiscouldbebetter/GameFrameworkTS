function VisualMesh(mesh)
{
	this.mesh = mesh;
}
{
	// Cloneable.

	VisualMesh.prototype.clone = function()
	{
		return new VisualMesh(this.mesh.clone());
	};

	VisualMesh.prototype.overwriteWith = function(other)
	{
		this.mesh.overwriteWith(other.mesh);
	};

	// Transformable.

	VisualMesh.prototype.transform = function(transformToApply)
	{
		transformToApply.transform(this.mesh);
	};

	// Visual.

	VisualMesh.prototype.draw = function(universe, world, display, entity)
	{
		display.drawMeshWithOrientation(this.mesh, entity.locatable.loc.orientation);
	};
}
