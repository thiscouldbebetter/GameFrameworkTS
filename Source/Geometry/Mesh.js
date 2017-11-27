
function Mesh(center, vertexOffsets, faceBuilders)
{
	this.center = center;
	this.vertexOffsets = vertexOffsets;
	this.faceBuilders = faceBuilders;
}
{
	// static methods

	Mesh.boxOfSize = function(center, size)
	{
		var bounds = new Bounds(center, size);
		var returnValue = Mesh.fromBounds(bounds);
		return returnValue;
	}

	Mesh.cubeUnit = function(center)
	{
		if (center == null)
		{
			center = new Coords(0, 0, 0);
		}
		var size = new Coords(2, 2, 2);
		var returnValue = Mesh.boxOfSize(center, size);
		return returnValue;
	}

	Mesh.fromBounds = function(bounds)
	{
		var sizeHalf = bounds.sizeHalf;
		var min = new Coords(-sizeHalf.x, -sizeHalf.y, -sizeHalf.z);
		var max = new Coords(sizeHalf.x, sizeHalf.y, sizeHalf.z);

		var vertexOffsets = 
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

		var faceBuilders = 
		[
			new Mesh_FaceBuilder([0, 1, 5, 4]), // north
			new Mesh_FaceBuilder([1, 2, 6, 5]), // east

			new Mesh_FaceBuilder([2, 3, 7, 6]), // south
			new Mesh_FaceBuilder([3, 0, 4, 7]), // west

			new Mesh_FaceBuilder([0, 3, 2, 1]), // top
			new Mesh_FaceBuilder([4, 5, 6, 7]), // bottom
		];

		var returnValue = new Mesh
		(
			bounds.center, vertexOffsets, faceBuilders
		);

		return returnValue;
	}

	Mesh.fromFace = function(center, faceToExtrude, thickness)
	{
		var faceVertices = faceToExtrude.vertices;
		var numberOfFaceVertices = faceVertices.length;
		var thicknessHalf = thickness / 2;

		var meshVertices = [];
		var faceBuilders = [];

		for (var z = 0; z < 2; z++)
		{
			var offsetForExtrusion = new Coords
			(
				0, 0, (z == 0 ? -1 : 1)
			).multiplyScalar
			(
				thicknessHalf
			);

			var vertexIndicesTopOrBottom = [];

			for (var v = 0; v < numberOfFaceVertices; v++)
			{
				var vertexIndex = meshVertices.length;

				if (z == 0)
				{
					var vertexIndexNext = 
					(
						vertexIndex + 1
					).wrapToRangeMinMax
					(
						0, numberOfFaceVertices
					);

					var faceBuilderSide = new Mesh_FaceBuilder
					([
						vertexIndex, 
						vertexIndexNext,
						vertexIndexNext + numberOfFaceVertices, 
						vertexIndex + numberOfFaceVertices
					]);
					faceBuilders.push(faceBuilderSide);

					vertexIndicesTopOrBottom.push(vertexIndex);
				}
				else
				{
					vertexIndicesTopOrBottom.splice(0, 0, vertexIndex);
				}

				var vertex = faceVertices[v].clone().add
				(
					offsetForExtrusion
				);

				meshVertices.push(vertex);
			}

			var faceBuilderTopOrBottom = new Mesh_FaceBuilder
			(
				vertexIndicesTopOrBottom
			);
			faceBuilders.push(faceBuilderTopOrBottom);
		}

		var returnValue = new Mesh
		(
			center,
			meshVertices, // vertexOffsets
			faceBuilders
		);

		return returnValue;
	}

	// instance methods

	Mesh.prototype.faces = function()
	{
		var vertices = this.vertices();

		if (this._faces == null)
		{
			this._faces = [];

			for (var f = 0; f < this.faceBuilders.length; f++)
			{
				var faceBuilder = this.faceBuilders[f];
				var face = faceBuilder.faceBuildForMeshVertices(vertices);
				this._faces.push(face);
			}
		}
		else
		{
			for (var f = 0; f < this._faces.length; f++)
			{
				var face = this._faces[f];
				face.recalculate();
			}
		}

		return this._faces;
	}

	Mesh.prototype.vertices = function()
	{
		if (this._vertices == null)
		{
			this._vertices = [];
			for (var v = 0; v < this.vertexOffsets.length; v++)
			{
				this._vertices.push(new Coords());
			}
		}

		for (var v = 0; v < this._vertices.length; v++)
		{
			var vertex = this._vertices[v];
			var vertexOffset = this.vertexOffsets[v];
			vertex.overwriteWith(this.center).add(vertexOffset);
		}

		return this._vertices;
	}

	// transformable

	Mesh.prototype.transform = function(transformToApply)
	{
		for (var v = 0; v < this.vertexOffsets.length; v++)
		{
			var vertexOffset = this.vertexOffsets[v];
			transformToApply.transformCoords(vertexOffset);
		}

		return this;
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
		for (var vi = 0; vi < this.vertexIndices.length; vi++)
		{
			var vertexIndex = this.vertexIndices[vi];
			var meshVertex = meshVertices[vertexIndex];
			faceVertices.push(meshVertex);
		}
		var returnValue = new Face(faceVertices);
		return returnValue;
	}
}

