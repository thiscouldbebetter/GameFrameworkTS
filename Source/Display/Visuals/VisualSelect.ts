
namespace ThisCouldBeBetter.GameFramework
{

export class VisualSelect extends VisualBase<VisualSelect>
{
	_selectChildToShow:
		(uwpe: UniverseWorldPlaceEntities, visualSelect: VisualSelect) => Visual;
	children: Visual[];

	constructor
	(
		selectChildToShow:
			(uwpe: UniverseWorldPlaceEntities, visualSelect: VisualSelect) => Visual,
		children: Visual[]
	)
	{
		super();

		this._selectChildToShow = selectChildToShow;
		this.children = children;
	}

	static fromSelectChildToShowAndChildren
	(
		selectChildToShow:
			(uwpe: UniverseWorldPlaceEntities, visualSelect: VisualSelect) => Visual,
		children: Visual[]
	): VisualSelect
	{
		return new VisualSelect
		(
			selectChildToShow, children
		);
	}

	childByIndex(childIndex: number): Visual
	{
		return this.children[childIndex];
	}

	selectChildToShow
	(
		uwpe: UniverseWorldPlaceEntities,
		visualSelect: VisualSelect
	): Visual
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
