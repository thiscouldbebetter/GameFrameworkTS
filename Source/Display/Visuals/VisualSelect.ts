
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

	static fromChildrenByNameAndSelectChildNames
	(
		childrenByName: Map<string, VisualBase>,
		selectChildNames: (uwpe: UniverseWorldPlaceEntities, d: Display) => string[]
	): VisualSelect
	{
		return new VisualSelect
		(
			childrenByName, selectChildNames
		);
	}

	childByName(childName: string): VisualBase
	{
		return this.childrenByName.get(childName);
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		for (var childName in this.childrenByName)
		{
			var child = this.childrenByName.get(childName);
			child.initialize(uwpe);
		}
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		var childrenAreAllInitializedSoFar = true;

		for (var childName in this.childrenByName)
		{
			var child = this.childrenByName.get(childName);
			var childIsInitialized = child.initializeIsComplete(uwpe);
			if (childIsInitialized == false)
			{
				childrenAreAllInitializedSoFar = false;
			}
		}

		return childrenAreAllInitializedSoFar;
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
