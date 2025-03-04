
namespace ThisCouldBeBetter.GameFramework
{

export class VisualStack implements Visual<VisualStack>
{
	childSpacing: Coords;
	children: VisualBase[];

	private _posSaved: Coords;

	constructor(childSpacing: Coords, children: VisualBase[])
	{
		this.childSpacing = childSpacing;
		this.children = children;

		this._posSaved = Coords.create();
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.children.forEach(x => x.initialize(uwpe) );
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		var childrenAreAllInitialized =
			(this.children.some(x => x.initializeIsComplete(uwpe) == false) == false);
		return childrenAreAllInitialized;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display)
	{
		var entity = uwpe.entity;
		var drawPos = Locatable.of(entity).loc.pos;
		this._posSaved.overwriteWith(drawPos);

		for (var i = 0; i < this.children.length; i++)
		{
			//var child = this.children[i];
			var wasChildVisible = true; // hack
				// child.draw(uwpe, display);
			if (wasChildVisible)
			{
				drawPos.add(this.childSpacing);
			}
		}

		drawPos.overwriteWith(this._posSaved);
	}

	// Clonable.

	clone(): VisualStack
	{
		return new VisualStack
		(
			this.childSpacing.clone(), ArrayHelper.clone(this.children)
		);
	}

	overwriteWith(other: VisualStack): VisualStack
	{
		this.childSpacing.overwriteWith(other.childSpacing);
		ArrayHelper.overwriteWith(this.children, other.children);
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualStack
	{
		this.children.forEach(x => transformToApply.transform(x));
		return this;
	}
}

}
