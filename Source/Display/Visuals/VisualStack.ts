
namespace ThisCouldBeBetter.GameFramework
{

export class VisualStack extends VisualBase<VisualStack>
{
	childSpacing: Coords;
	children: Visual[];

	private _posSaved: Coords;

	constructor(childSpacing: Coords, children: Visual[])
	{
		super();

		this.childSpacing = childSpacing;
		this.children = children;

		this._posSaved = Coords.create();
	}

	static fromSpacingAndChildren(childSpacing: Coords, children: Visual[]): VisualStack
	{
		return new VisualStack(childSpacing, children);
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
