
namespace ThisCouldBeBetter.GameFramework
{

export class VertexGroup
{
	name: string;
	vertexIndices: number[];

	constructor(name: string, vertexIndices: number[])
	{
		this.name = name;
		this.vertexIndices = vertexIndices;
	}

	// Clonable.

	clone(): VertexGroup
	{
		return new VertexGroup(this.name, this.vertexIndices.slice());
	}

	overwriteWith(other: VertexGroup): VertexGroup
	{
		this.name = other.name;
		ArrayHelper.overwriteWithNonClonables
		(
			this.vertexIndices, other.vertexIndices
		);
		return this;
	}
}

}
