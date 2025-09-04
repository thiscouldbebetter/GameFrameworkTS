
namespace ThisCouldBeBetter.GameFramework
{

export class VisualSelect implements Visual<VisualSelect>
{
	_selectChildToShow:
		(uwpe: UniverseWorldPlaceEntities, visualSelect: VisualSelect) => VisualBase;
	children: VisualBase[];

	constructor
	(
		selectChildToShow:
			(uwpe: UniverseWorldPlaceEntities, visualSelect: VisualSelect) => VisualBase,
		children: VisualBase[]
	)
	{
		this._selectChildToShow = selectChildToShow;
		this.children = children;
	}

	static fromSelectChildToShowAndChildren
	(
		selectChildToShow:
			(uwpe: UniverseWorldPlaceEntities, visualSelect: VisualSelect) => VisualBase,
		children: VisualBase[]
	): VisualSelect
	{
		return new VisualSelect
		(
			selectChildToShow, children
		);
	}

	childByIndex(childIndex: number): VisualBase
	{
		return this.children[childIndex];
	}

	selectChildToShow
	(
		uwpe: UniverseWorldPlaceEntities,
		visualSelect: VisualSelect
	): VisualBase
	{
		return this._selectChildToShow(uwpe, visualSelect);
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.children.forEach(x => x.initialize(uwpe) );
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		var atLeastOneChildIsNotInitialized =
			this.children.some(x => x.initializeIsComplete(uwpe) == false);

		var childrenAreAllInitialized =
			(atLeastOneChildIsNotInitialized == false);

		return childrenAreAllInitialized;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var childToShow = this.selectChildToShow(uwpe, this);

		childToShow.draw(uwpe, display);
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
