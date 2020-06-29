
class MeshTextured
{
	constructor(geometry, materials, faceTextures, vertexGroups)
	{
		this.geometry = geometry;
		this.materials = materials.addLookupsByName();
		this.faceTextures = faceTextures;
		this.vertexGroups = vertexGroups;
	}

	faces()
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
				var faceMaterial = this.materials[faceMaterialName];
				var face = new FaceTextured(geometryFace, faceMaterial);
				this._faces.push(face);
			}
		}

		return this._faces;
	};

	faceTexturesBuild()
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
					new Coords(0, 0),
					new Coords(1, 0),
					new Coords(1, 1),
					new Coords(1, 0)
				]
			);
			faceTextures.push(faceTexture);
		}

		this.faceTextures = faceTextures;

		return this;
	};

	faceIndicesByMaterial()
	{
		if (this._faceIndicesByMaterial == null)
		{
			this._faceIndicesByMaterial = [];

			for (var f = 0; f < this.faceTextures.length; f++)
			{
				var faceTexture = this.faceTextures[f];

				var faceMaterialName = faceTexture.materialName;
				var faceIndicesForMaterial =
					this._faceIndicesByMaterial[faceMaterialName];
				if (faceIndicesForMaterial == null)
				{
					faceIndicesForMaterial = [];
					this._faceIndicesByMaterial[faceMaterialName] =
						faceIndicesForMaterial;
				}
				faceIndicesForMaterial.push(f);
			}
		}

		return this._faceIndicesByMaterial;
	};

	transform(transformToApply)
	{
		this.geometry.transform(transformToApply);

		return this;
	};

	transformFaceTextures(transformToApply)
	{
		for (var i = 0; i < this.faceTextures.length; i++)
		{
			var faceTexture = this.faceTextures[i];
			faceTexture.transform(transformToApply);
		}

		return this;
	};

	// cloneable

	clone()
	{
		return new MeshTextured
		(
			this.geometry.clone(),
			this.materials,
			( this.faceTextures == null ? null : this.faceTextures.clone() ),
			( this.vertexGroups == null ? null : this.vertexGroups.clone() )
		);
	};

	overwriteWith(other)
	{
		this.geometry.overwriteWith(other.geometry);
		// todo
		return this;
	};
}

class MeshTexturedFaceTexture
{
	constructor(materialName, textureUVs)
	{
		this.materialName = materialName;
		this.textureUVs = textureUVs;
	}

	clone()
	{
		return new MeshTexturedFaceTexture
		(
			this.materialName, this.textureUVs.clone()
		);
	};

	transform(transformToApply)
	{
		for (var i = 0; i < this.textureUVs.length; i++)
		{
			var textureUV = this.textureUVs[i];
			transformToApply.transformCoords(textureUV);
		}
		return this;
	};
}
