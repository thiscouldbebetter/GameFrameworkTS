
namespace ThisCouldBeBetter.GameFramework
{

export class MeshTextured implements ShapeBase
{
	geometry: Mesh;
	materials: Material[];
	materialsByName: Map<string, Material>;
	faceTextures: MeshTexturedFaceTexture[];
	vertexGroups: VertexGroup[];

	_faceIndicesByMaterialName: Map<string, number[]>;
	_faces: FaceTextured[];

	constructor
	(
		geometry: Mesh, materials: Material[],
		faceTextures: MeshTexturedFaceTexture[], vertexGroups: VertexGroup[]
	)
	{
		this.geometry = geometry;
		this.materials = materials;
		this.materialsByName = ArrayHelper.addLookupsByName(this.materials);
		this.faceTextures = faceTextures;
		this.vertexGroups = vertexGroups;
	}

	static fromMeshAndMaterials(geometry: Mesh, materials: Material[]): MeshTextured
	{
		return new MeshTextured(geometry, materials, null, null);
	}

	faces(): FaceTextured[]
	{
		if (this._faces == null)
		{
			this._faces = [];
			var geometryFaces = this.geometry.faces();
			for (var i = 0; i < geometryFaces.length; i++)
			{
				var geometryFace = geometryFaces[i];
				var faceTexture = this.faceTextures[i];
				var faceMaterialName = faceTexture.materialName;
				var faceMaterial = this.materialsByName.get(faceMaterialName);
				var face = new FaceTextured(geometryFace, faceMaterial);
				this._faces.push(face);
			}
		}

		return this._faces;
	}

	faceTexturesBuild(): MeshTextured
	{
		var materialName = this.materials[0].name;

		var faceTextures = [];

		var numberOfFaces = this.geometry.faceBuilders.length;
		for (var f = 0; f < numberOfFaces; f++)
		{
			var faceTexture = new MeshTexturedFaceTexture
			(
				materialName,
				[
					Coords.create(),
					new Coords(1, 0, 0),
					new Coords(1, 1, 0),
					new Coords(1, 0, 0)
				]
			);
			faceTextures.push(faceTexture);
		}

		this.faceTextures = faceTextures;

		return this;
	}

	faceIndicesByMaterialName(): Map<string, number[]>
	{
		if (this._faceIndicesByMaterialName == null)
		{
			this._faceIndicesByMaterialName = new Map<string, number[]>();

			for (var f = 0; f < this.faceTextures.length; f++)
			{
				var faceTexture = this.faceTextures[f];

				var faceMaterialName = faceTexture.materialName;
				var faceIndicesForMaterial =
					this._faceIndicesByMaterialName.get(faceMaterialName);
				if (faceIndicesForMaterial == null)
				{
					faceIndicesForMaterial = [];
					this._faceIndicesByMaterialName.set
					(
						faceMaterialName,
						faceIndicesForMaterial
					);
				}
				faceIndicesForMaterial.push(f);
			}
		}

		return this._faceIndicesByMaterialName;
	}

	transform(transformToApply: Transform): MeshTextured
	{
		this.geometry.transform(transformToApply);

		return this;
	}

	transformFaceTextures(transformToApply: Transform): MeshTextured
	{
		for (var i = 0; i < this.faceTextures.length; i++)
		{
			var faceTexture = this.faceTextures[i];
			faceTexture.transform(transformToApply);
		}

		return this;
	}

	// cloneable

	clone(): MeshTextured
	{
		return new MeshTextured
		(
			this.geometry.clone(),
			this.materials,
			ArrayHelper.clone(this.faceTextures),
			ArrayHelper.clone(this.vertexGroups)
		);
	}

	overwriteWith(other: MeshTextured): MeshTextured
	{
		this.geometry.overwriteWith(other.geometry);
		// todo
		return this;
	}

	// ShapeBase.

	locate(loc: Disposition): ShapeBase
	{
		throw new Error("Not implemented!");
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		throw new Error("Not implemented!");
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		throw new Error("Not implemented!");
	}

	toBox(boxOut: Box): Box
	{
		throw new Error("Not implemented!");
	}
}

export class MeshTexturedFaceTexture
{
	materialName: string;
	textureUVs: Coords[];

	constructor(materialName: string, textureUVs: Coords[])
	{
		this.materialName = materialName;
		this.textureUVs = textureUVs;
	}

	clone(): MeshTexturedFaceTexture
	{
		return new MeshTexturedFaceTexture
		(
			this.materialName, ArrayHelper.clone(this.textureUVs)
		);
	}

	// Transformable.

	transform(transformToApply: Transform): MeshTexturedFaceTexture
	{
		for (var i = 0; i < this.textureUVs.length; i++)
		{
			var textureUV = this.textureUVs[i];
			transformToApply.transformCoords(textureUV);
		}
		return this;
	}
}

}
