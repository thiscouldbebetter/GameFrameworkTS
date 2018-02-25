
function VertexGroup(name, vertexIndices)
{
	this.name = name;
	this.vertexIndices = vertexIndices;
}

{
	// cloneable

	VertexGroup.prototype.clone = function()
	{
		return new VertexGroup(this.name, this.vertexIndices.slice());
	}
}
