
namespace ThisCouldBeBetter.GameFramework
{

export class Mesh extends ShapeBase
{
	center: Coords;
	vertexOffsets: Coords[];
	faceBuilders: Mesh_FaceBuilder[];

	_boxAxisAligned: BoxAxisAligned;
	_faces: Face[];
	_vertices: Coords[];

	constructor
	(
		center: Coords,
		vertexOffsets: Coords[],
		faceBuilders: Mesh_FaceBuilder[]
	)
	{
		super();

		this.center = center;
		this.vertexOffsets = vertexOffsets;
		this.faceBuilders = faceBuilders;
	}

	// static methods

	static boxOfSize(center: Coords, size: Coords): Mesh
	{
		var box = BoxAxisAligned.fromCenterAndSize(center, size);
		var returnValue = Mesh.fromBox(box);
		return returnValue;
	}

	static cubeUnit(center: Coords): Mesh
	{
		if (center == null)
		{
			center = Coords.create();
		}
		var size = Coords.fromXYZ(2, 2, 2);
		var returnValue = Mesh.boxOfSize(center, size);
		return returnValue;
	}

	static fromBox(box: BoxAxisAligned): Mesh
	{
		var sizeHalf = box.sizeHalf();
		var min = Coords.fromXYZ(-sizeHalf.x, -sizeHalf.y, -sizeHalf.z);
		var max = Coords.fromXYZ(sizeHalf.x, sizeHalf.y, sizeHalf.z);

		var vertexOffsets =
		[
			// top
			Coords.fromXYZ(min.x, min.y, min.z),
			Coords.fromXYZ(max.x, min.y, min.z),
			Coords.fromXYZ(max.x, max.y, min.z),
			Coords.fromXYZ(min.x, max.y, min.z),

			// bottom
			Coords.fromXYZ(min.x, min.y, max.z),
			Coords.fromXYZ(max.x, min.y, max.z),
			Coords.fromXYZ(max.x, max.y, max.z),
			Coords.fromXYZ(min.x, max.y, max.z),
		];

		var faceBuilders =
		[
			Mesh_FaceBuilder.fromVertexIndices([0, 1, 5, 4]), // north
			Mesh_FaceBuilder.fromVertexIndices([1, 2, 6, 5]), // east

			Mesh_FaceBuilder.fromVertexIndices([2, 3, 7, 6]), // south
			Mesh_FaceBuilder.fromVertexIndices([3, 0, 4, 7]), // west

			Mesh_FaceBuilder.fromVertexIndices([0, 3, 2, 1]), // top
			Mesh_FaceBuilder.fromVertexIndices([4, 5, 6, 7]), // bottom
		];

		var returnValue = Mesh.fromCenterVertexOffsetsAndFaceBuilders
		(
			box.center, vertexOffsets, faceBuilders
		);

		return returnValue;
	}

	static fromCenterVertexOffsetsAndFaceBuilders
	(
		center: Coords,
		vertexOffsets: Coords[],
		faceBuilders: Mesh_FaceBuilder[]
	)
	{
		return new Mesh(center, vertexOffsets, faceBuilders);
	}

	static fromFace(center: Coords, faceToExtrude: Face, thickness: number): Mesh
	{
		var faceVertices = faceToExtrude.vertices;
		var numberOfFaceVertices = faceVertices.length;
		var thicknessHalf = thickness / 2;

		var meshVertices = [];
		var faceBuilders = [];

		for (var z = 0; z < 2; z++)
		{
			var offsetForExtrusion = Coords.fromXYZ
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
					var vertexIndexNext = NumberHelper.wrapToRangeMinMax
					(
						vertexIndex + 1,
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

	box(): BoxAxisAligned
	{
		if (this._boxAxisAligned == null)
		{
			this._boxAxisAligned = BoxAxisAligned.create();
		}
		this._boxAxisAligned.containPoints(this.vertices());
		return this._boxAxisAligned;
	}

	edges(): Edge[]
	{
		return null; // todo
	}

	faces(): Face[]
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
	}

	vertices(): Coords[]
	{
		if (this._vertices == null)
		{
			this._vertices = [];
			for (var v = 0; v < this.vertexOffsets.length; v++)
			{
				this._vertices.push(Coords.create());
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

	// clonable

	clone(): Mesh
	{
		return new Mesh
		(
			this.center.clone(),
			ArrayHelper.clone(this.vertexOffsets),
			ArrayHelper.clone(this.faceBuilders)
		);
	}

	overwriteWith(other: Mesh): Mesh
	{
		this.center.overwriteWith(other.center);
		ArrayHelper.overwriteWith(this.vertexOffsets, other.vertexOffsets);
		ArrayHelper.overwriteWith(this.faceBuilders, other.faceBuilders);
		return this;
	}

	// Equatable

	equals(other: Shape) { return false; } // todo

	// Transformable.

	coordsGroupToTransform(): Coords[]
	{
		return [ this.center ];
	}

	transform(transformToApply: TransformBase): Mesh
	{
		for (var v = 0; v < this.vertexOffsets.length; v++)
		{
			var vertexOffset = this.vertexOffsets[v];
			transformToApply.transformCoords(vertexOffset);
		}

		this.vertices(); // hack - Recalculate.

		return this;
	}

	// ShapeBase.

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		return this.box().normalAtPos(posToCheck, normalOut);
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		return surfacePointOut.overwriteWith(posToCheck); // todo
	}

	toBoxAxisAligned(boxOut: BoxAxisAligned): BoxAxisAligned
	{
		return boxOut.containPoints(this.vertices());
	}
}

export class Mesh_FaceBuilder
{
	vertexIndices: number[];

	constructor(vertexIndices: number[])
	{
		this.vertexIndices = vertexIndices;
	}

	static fromVertexIndices(vertexIndices: number[]): Mesh_FaceBuilder
	{
		return new Mesh_FaceBuilder(vertexIndices);
	}

	toFace(meshVertices: Coords[]): Face
	{
		var faceVertices: Coords[] = [];
		for (var vi = 0; vi < this.vertexIndices.length; vi++)
		{
			var vertexIndex = this.vertexIndices[vi];
			var meshVertex = meshVertices[vertexIndex];
			faceVertices.push(meshVertex);
		}
		var returnValue = new Face(faceVertices);
		return returnValue;
	}

	vertexIndicesShift(offset: number): void
	{
		for (var i = 0; i < this.vertexIndices.length; i++)
		{
			var vertexIndex = this.vertexIndices[i];
			vertexIndex += offset;
			this.vertexIndices[i] = vertexIndex;
		}
	}

	// clonable

	clone(): Mesh_FaceBuilder
	{
		return new Mesh_FaceBuilder(this.vertexIndices.slice());
	}

	overwriteWith(other: Mesh_FaceBuilder): Mesh_FaceBuilder
	{
		ArrayHelper.overwriteWithNonClonables
		(
			this.vertexIndices, other.vertexIndices
		);
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): Mesh_FaceBuilder { throw new Error("Not implemented!");  }

}

}
