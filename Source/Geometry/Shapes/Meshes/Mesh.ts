
namespace ThisCouldBeBetter.GameFramework
{

export class Mesh implements ShapeBase
{
	center: Coords;
	vertexOffsets: Coords[];
	faceBuilders: Mesh_FaceBuilder[];

	_box: Box;
	_faces: Face[];
	_vertices: Coords[];

	constructor
	(
		center: Coords,
		vertexOffsets: Coords[],
		faceBuilders: Mesh_FaceBuilder[]
	)
	{
		this.center = center;
		this.vertexOffsets = vertexOffsets;
		this.faceBuilders = faceBuilders;
	}

	// static methods

	static boxOfSize(center: Coords, size: Coords): Mesh
	{
		var box = new Box(center, size);
		var returnValue = Mesh.fromBox(box);
		return returnValue;
	}

	static cubeUnit(center: Coords): Mesh
	{
		if (center == null)
		{
			center = Coords.create();
		}
		var size = new Coords(2, 2, 2);
		var returnValue = Mesh.boxOfSize(center, size);
		return returnValue;
	}

	static fromBox(box: Box): Mesh
	{
		var sizeHalf = box.sizeHalf();
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

	box(): Box
	{
		if (this._box == null)
		{
			this._box = new Box(Coords.create(), Coords.create());
		}
		this._box.containPoints(this.vertices());
		return this._box;
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

	// transformable

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

	equals(other: ShapeBase) { return false; } // todo

	// transformable

	coordsGroupToTranslate(): Coords[]
	{
		return [ this.center ];
	}

	// ShapeBase.

	collider(): ShapeBase { return null; }

	locate(loc: Disposition): ShapeBase
	{
		return ShapeHelper.Instance().applyLocationToShapeDefault(loc, this);
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		return this.box().normalAtPos(posToCheck, normalOut);
	}

	pointRandom(randomizer: Randomizer): Coords
	{
		return null; // todo
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		return surfacePointOut.overwriteWith(posToCheck); // todo
	}

	toBox(boxOut: Box): Box
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
