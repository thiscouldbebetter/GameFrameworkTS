
function Mesh(vertices, faceBuilders)
{
	this.vertices = vertices;
	this.faceBuilders = faceBuilders;
}
{
	// static methods

	Mesh.fromBounds = function(bounds)
	{
		var min = bounds.min();
		var max = bounds.max();

		var vertices = 
		[
			// top
			new Coords(min.x, min.y, min.z),
			new Coords(max.x, min.y, min.z),
			new Coords(max.x, max.y, min.z),
			new Coords(min.x, max.y, min.z),

			// bottom
			new Coords(min.x, min.y, max.z),
			new Coords(max.x, min.y, max.z),
			new Coords(max.x, max.y, max.z),
			new Coords(min.x, max.y, max.z),
		];

		// todo - Reorder vertex indices so that normals point in correct directions.
		var faceBuilders = 
		[
			new Mesh_FaceBuilder([0, 1, 5, 4]), // north
			new Mesh_FaceBuilder([1, 2, 6, 5]), // east

			new Mesh_FaceBuilder([2, 3, 7, 6]), // south
			new Mesh_FaceBuilder([3, 0, 4, 7]), // west

			new Mesh_FaceBuilder([0, 1, 2, 3]), // top
			new Mesh_FaceBuilder([4, 5, 6, 7]), // bottom
		];

		var returnValue = new Mesh(vertices, faceBuilders);

		return returnValue;
	}

	// instance methods

	Mesh.prototype.faces = function()
	{
		if (this._faces == null)
		{
			for (var f = 0; f < this.faceBuilders.length; f++)
			{
				var faceBuilder = this.faceBuilders[f];
				faceBuilder.faceBuildForMeshVertices(this.vertices);
			}
		}

		return this._faces;
	}
}

function Mesh_FaceBuilder(vertexIndices)
{
	this.vertexIndices = vertexIndices;
}
{
	Mesh_FaceBuilder.prototype.faceBuildForMeshVertices = function(meshVertices)
	{
		var faceVertices = [];
		for (var v = 0; v < meshVertices.length; v++)
		{
			var meshVertex = meshVertices[v];
			faceVertices.push(meshVertex);
		}
		var returnValue = new Face(faceVertices);
		return returnValue;
	}
}

