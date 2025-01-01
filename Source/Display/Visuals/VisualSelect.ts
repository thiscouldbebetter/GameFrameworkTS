
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

	childByName(childName: string): VisualBase
	{
		return this.childrenByName.get(childName);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var childrenToSelectNames =
			this.selectChildNames(uwpe, display);
		var childrenSelected = childrenToSelectNames.map
		(
			childToSelectName => this.childByName(childToSelectName)
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
