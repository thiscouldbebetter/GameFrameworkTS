
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

	// cloneable

	clone()
	{
		return new VertexGroup(this.name, this.vertexIndices.slice());
	}
}

}
