
namespace ThisCouldBeBetter.GameFramework
{

export class VisualMesh implements Visual
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
	}

	overwriteWith(other: Visual): Visual
	{
		var otherAsVisualMesh = other as VisualMesh;
		this.mesh.overwriteWith(otherAsVisualMesh.mesh);
		return this;
	}

	// Transformable.

	transform(transformToApply: Transform)
	{
		transformToApply.transform(this.mesh);
		return this;
	}

	// Visual.

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		display.drawMeshWithOrientation(this.mesh, entity.locatable().loc.orientation);
	}
}

}
