
class VertexGroup
{
	constructor(name, vertexIndices)
	{
		this.name = name;
		this.vertexIndices = vertexIndices;
	}

	// cloneable

	clone()
	{
		return new VertexGroup(this.name, this.vertexIndices.slice());
	};
}
