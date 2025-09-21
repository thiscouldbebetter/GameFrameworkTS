
namespace ThisCouldBeBetter.GameFramework
{

export class VisualMesh extends VisualBase<VisualMesh>
{
	private mesh: MeshTextured;

	constructor(mesh: MeshTextured)
	{
		super();

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

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// todo
		// Do nothing.
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return true; // todo
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		display.drawMeshWithOrientation(this.mesh, Locatable.of(entity).loc.orientation);
	}
}

}
