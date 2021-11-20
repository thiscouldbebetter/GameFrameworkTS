
namespace ThisCouldBeBetter.GameFramework
{

export class VisualMesh implements Visual<VisualMesh>
{
	private mesh: MeshTextured;

	constructor(mesh: MeshTextured)
	{
		this.mesh = mesh;
	}

	// Cloneable.

	clone(): VisualMesh
	{
		return new VisualMesh(this.mesh.clone());
	}

	overwriteWith(other: VisualMesh): VisualMesh
	{
		this.mesh.overwriteWith(other.mesh);
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualMesh
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
