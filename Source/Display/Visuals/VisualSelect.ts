
namespace ThisCouldBeBetter.GameFramework
{

export class VisualSelect implements Visual<VisualSelect>
{
	childrenByName: Map<string, VisualBase>;
	selectChildNames: (uwpe: UniverseWorldPlaceEntities, d: Display) => string[];

	constructor
	(
		childrenByName: Map<string, VisualBase>,
		selectChildNames: (uwpe: UniverseWorldPlaceEntities, d: Display) => string[]
	)
	{
		this.childrenByName = childrenByName;
		this.selectChildNames = selectChildNames;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var childrenToSelectNames =
			this.selectChildNames(uwpe, display);
		var childrenSelected = childrenToSelectNames.map
		(
			childToSelectName => this.childrenByName.get(childToSelectName)
		);
		childrenSelected.forEach
		(
			childSelected => childSelected.draw(uwpe, display)
		);
	}

	// Clonable.

	clone(): VisualSelect
	{
		return this; // todo
	}

	overwriteWith(other: VisualSelect): VisualSelect
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualSelect
	{
		return this; // todo
	}
}

}
