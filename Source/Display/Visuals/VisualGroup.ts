
namespace ThisCouldBeBetter.GameFramework
{

export class VisualGroup implements Visual<VisualGroup>
{
	children: VisualBase[];

	constructor(children: VisualBase[])
	{
		this.children = children;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.draw(uwpe, display);
		}
	}

	// Clonable.

	clone(): VisualGroup
	{
		return new VisualGroup(ArrayHelper.clone(this.children) );
	}

	overwriteWith(other: VisualGroup): VisualGroup
	{
		ArrayHelper.overwriteWith(this.children, other.children);
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualGroup
	{
		this.children.forEach(x => transformToApply.transform(x));
		return this;
	}
}

}
