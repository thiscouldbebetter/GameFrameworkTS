
class VisualMesh implements Visual
{
	private mesh: MeshTextured;

	constructor(mesh: MeshTextured)
	{
		this.mesh = mesh;
	}

	// Cloneable.

	clone(): Visual
	{
		return new VisualMesh(this.mesh.clone());
	};

	overwriteWith(other: Visual): Visual
	{
		var otherAsVisualMesh = other as VisualMesh;
		this.mesh.overwriteWith(otherAsVisualMesh.mesh);
		return this;
	};

	// Transformable.

	transform(transformToApply: Transform)
	{
		transformToApply.transform(this.mesh);
		return this;
	};

	// Visual.

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		display.drawMeshWithOrientation(this.mesh, entity.locatable().loc.orientation);
	};
}
