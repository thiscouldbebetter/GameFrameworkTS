
class Mesh
{
	constructor(center, vertexOffsets, faceBuilders)
	{
		this.center = center;
		this.vertexOffsets = vertexOffsets;
		this.faceBuilders = faceBuilders;
	}

	// static methods

	static boxOfSize(center, size)
	{
		var box = new Box(center, size);
		var returnValue = Mesh.fromBox(box);
		return returnValue;
	};

	static cubeUnit(center)
	{
		if (center == null)
		{
			center = new Coords(0, 0, 0);
		}
		var size = new Coords(2, 2, 2);
		var returnValue = Mesh.boxOfSize(center, size);
		return returnValue;
	};

	static fromBox(box)
	{
		var sizeHalf = box.sizeHalf;
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
			box.center, vertexOffsets, faceBuilders
		);

		return returnValue;
	};

	static fromFace(center, faceToExtrude, thickness)
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
					vertexIndicesTopOrBottom.insertElementAt(vertexIndex, 0);
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
	};

	// instance methods

	box()
	{
		if (this._box == null)
		{
			this._box = new Box(new Coords(), new Coords());
		}
		this._box.ofPoints(this.vertices());
		return this._box;
	};

	faces()
	{
		var vertices = this.vertices();

		if (this._faces == null)
		{
			this._faces = [];

			for (var f = 0; f < this.faceBuilders.length; f++)
			{
				var faceBuilder = this.faceBuilders[f];
				var face = faceBuilder.toFace(vertices);
				this._faces.push(face);
			}
		}

		return this._faces;
	};

	vertices()
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
	};

	// transformable

	transform(transformToApply)
	{
		for (var v = 0; v < this.vertexOffsets.length; v++)
		{
			var vertexOffset = this.vertexOffsets[v];
			transformToApply.transformCoords(vertexOffset);
		}

		this.vertices(); // hack - Recalculate.

		return this;
	};

	// clonable

	clone()
	{
		return new Mesh
		(
			this.center.clone(),
			this.vertexOffsets.clone(),
			this.faceBuilders.clone()
		);
	};

	overwriteWith(other)
	{
		this.center.overwriteWith(other.center);
		this.vertexOffsets.overwriteWith(other.vertexOffsets);
		this.faceBuilders.overwriteWith(other.faceBuilders);
	};

	// transformable

	coordsGroupToTranslate()
	{
		return [ this.center ];
	};
}

class Mesh_FaceBuilder
{
	constructor(vertexIndices)
	{
		this.vertexIndices = vertexIndices;
	}

	toFace(meshVertices)
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
	};

	vertexIndicesShift(offset)
	{
		for (var i = 0; i < this.vertexIndices.length; i++)
		{
			var vertexIndex = this.vertexIndices[i];
			vertexIndex += offset;
			this.vertexIndices[i] = vertexIndex;
		}
	};

	// clonable

	clone()
	{
		return new Mesh_FaceBuilder(this.vertexIndices.slice());
	};

	overwriteWith(other)
	{
		this.vertexIndices.overwriteWith(other.vertexIndices);
	};
}
