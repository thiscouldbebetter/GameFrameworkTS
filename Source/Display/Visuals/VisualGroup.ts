
namespace ThisCouldBeBetter.GameFramework
{

export class VisualGroup implements Visual<VisualGroup>
{
	name: string;
	children: VisualBase[];

	constructor(name: string, children: VisualBase[])
	{
		this.name = name;
		this.children = children;
	}

	static fromChildren(children: VisualBase[]): VisualGroup
	{
		return new VisualGroup(null, children);
	}

	static fromNameAndChildren
	(
		name: string,
		children: VisualBase[]
	): VisualGroup
	{
		return new VisualGroup(name, children);
	}

	childAdd(childToAdd: VisualBase): VisualGroup
	{
		this.children.push(childToAdd);
		return this;
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
		return new VisualGroup(this.name, ArrayHelper.clone(this.children) );
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
