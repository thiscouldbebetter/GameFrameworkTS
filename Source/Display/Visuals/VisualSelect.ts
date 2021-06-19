
namespace ThisCouldBeBetter.GameFramework
{

export class VisualSelect implements Visual
{
	childrenByName: Map<string, Visual>;
	selectChildNames: (uwpe: UniverseWorldPlaceEntities, d: Display) => string[];

	constructor
	(
		childrenByName: Map<string, Visual>,
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

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

}
