
namespace ThisCouldBeBetter.GameFramework
{

export class MeshTextured extends Mesh
{
	materials: Material[];
	materialsByName: Map<string, Material>;
	faceTextures: MeshTexturedFaceTexture[];
	vertexGroups: VertexGroup[];

	_faceIndicesByMaterialName: Map<string, number[]>;
	_faces: FaceTextured[];

	constructor
	(
		center: Coords,
		vertexOffsets: Coords[],
		faceBuilders: Mesh_FaceBuilder[],
		materials: Material[],
		faceTextures: MeshTexturedFaceTexture[],
		vertexGroups: VertexGroup[]
	)
	{
		super
		(
			center, vertexOffsets, faceBuilders
		);

		this.materials = materials;
		this.materialsByName = ArrayHelper.addLookupsByName(this.materials);
		this.faceTextures = faceTextures;
		this.vertexGroups = vertexGroups;
	}

	static fromGeometryMaterialsAndFaceTextures
	(
		geometry: Mesh,
		materials: Material[],
		faceTextures: MeshTexturedFaceTexture[]
	): MeshTextured
	{
		return new MeshTextured
		(
			geometry.center, geometry.vertexOffsets, geometry.faceBuilders, materials, faceTextures, null
		);
	}

	static fromMeshAndMaterials(geometry: Mesh, materials: Material[]): MeshTextured
	{
		return new MeshTextured
		(
			geometry.center, geometry.vertexOffsets, geometry.faceBuilders, materials, null, null
		);
	}

	faces(): FaceTextured[]
	{
		if (this._faces == null)
		{
			var geometryFaces = super.faces();
			this._faces = [];
			for (var i = 0; i < geometryFaces.length; i++)
			{
				var geometryFace = geometryFaces[i];
				var vertices = geometryFace.vertices;
				var faceTexture = this.faceTextures[i];
				var faceMaterialName = faceTexture.materialName;
				var faceMaterial = this.materialsByName.get(faceMaterialName);
				var face = new FaceTextured(vertices, faceMaterial);
				this._faces.push(face);
			}
		}

		return this._faces;
	}

	faceTexturesBuild(): MeshTextured
	{
		var materialName = this.materials[0].name;

		var faceTextures = [];

		var numberOfFaces = this.faceBuilders.length;
		for (var f = 0; f < numberOfFaces; f++)
		{
			var faceTexture = new MeshTexturedFaceTexture
			(
				materialName,
				[
					Coords.create(),
					Coords.fromXY(1, 0),
					Coords.fromXY(1, 1),
					Coords.fromXY(1, 0)
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

	transform(transformToApply: TransformBase): MeshTextured
	{
		super.transform(transformToApply);

		return this;
	}

	transformFaceTextures(transformToApply: TransformBase): MeshTextured
	{
		for (var i = 0; i < this.faceTextures.length; i++)
		{
			var faceTexture = this.faceTextures[i];
			faceTexture.transform(transformToApply);
		}

		return this;
	}

	// Clonable.

	clone(): MeshTextured
	{
		var center = this.center.clone();
		var vertexOffsets = this.vertexOffsets.map(x => x.clone() );
		var faceBuilders = this.faceBuilders.map(x => x.clone() );
		var faceTextures = this.faceTextures.map(x => x.clone() );
		var vertexGroups = this.vertexGroups == null ? null : this.vertexGroups.map(x => x.clone() );

		return new MeshTextured
		(
			center,
			vertexOffsets,
			faceBuilders,
			this.materials,
			faceTextures,
			vertexGroups
		);
	}

	overwriteWith(other: MeshTextured): MeshTextured
	{
		super.overwriteWith(other);
		// todo
		return this;
	}

	// Equatable

	equals(other: Shape) { return false; } // todo
}

export class MeshTexturedFaceTexture
{
	materialName: string;
	textureUVs: Coords[];

	constructor(materialName: string, textureUvs: Coords[] )
	{
		this.materialName = materialName;
		this.textureUVs = textureUvs;
	}

	static fromMaterialNameAndTextureUvs
	(
		materialName: string,
		textureUvs: Coords[]
	): MeshTexturedFaceTexture
	{
		return new MeshTexturedFaceTexture(materialName, textureUvs);
	}

	// Clonable.

	clone(): MeshTexturedFaceTexture
	{
		return new MeshTexturedFaceTexture
		(
			this.materialName, ArrayHelper.clone(this.textureUVs)
		);
	}
	
	overwriteWith(other: MeshTexturedFaceTexture): MeshTexturedFaceTexture
	{
		this.materialName = other.materialName;
		ArrayHelper.overwriteWith(this.textureUVs, other.textureUVs);
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): MeshTexturedFaceTexture
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
