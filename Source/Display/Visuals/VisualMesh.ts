class VisualMesh
{
	constructor(mesh)
	{
		this.mesh = mesh;
	}

	// Cloneable.

	clone()
	{
		return new VisualMesh(this.mesh.clone());
	};

	overwriteWith(other)
	{
		this.mesh.overwriteWith(other.mesh);
	};

	// Transformable.

	transform(transformToApply)
	{
		transformToApply.transform(this.mesh);
	};

	// Visual.

	draw(universe, world, display, entity)
	{
		display.drawMeshWithOrientation(this.mesh, entity.locatable.loc.orientation);
	};
}
