
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Multiple implements Transform<Transform_Multiple>
{
	children: TransformBase[];

	constructor(children: TransformBase[])
	{
		this.children = children;
	}

	static fromChildren(children: TransformBase[]): Transform_Multiple
	{
		return new Transform_Multiple(children);
	}

	clone(): Transform_Multiple
	{
		return new Transform_Multiple(this.children.map(x => x.clone() ) ); // todo
	}

	overwriteWith(other: Transform_Multiple): Transform_Multiple
	{
		for (var i = 0; i < this.children.length; i++)
		{
			this.children[i].overwriteWith(other.children[i]);
		}
		return this;
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			transformable.transform(child);
		}
		return transformable;
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.transformCoords(coordsToTransform);
		}
		return coordsToTransform;
	}
}

}
