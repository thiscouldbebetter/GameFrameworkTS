
function MeshTextured(geometry, materials, faceTextures, vertexGroups)
{
	this.geometry = geometry;
	this.materials = materials.addLookups("name");
	this.faceTextures = faceTextures;
	this.vertexGroups = vertexGroups;
}

{
	MeshTextured.prototype.faces = function()
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
	}

	MeshTextured.prototype.faceTexturesBuild = function()
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
	}

	MeshTextured.prototype.faceIndicesByMaterial = function()
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
	}

	MeshTextured.prototype.transform = function(transformToApply)
	{
		this.geometry.transform(transformToApply);

		return this;
	}

	MeshTextured.prototype.transformFaceTextures = function(transformToApply)
	{
		for (var i = 0; i < this.faceTextures.length; i++)
		{
			var faceTexture = this.faceTextures[i];

			Transform.applyTransformToCoordsMany
			(
				transformToApply,
				faceTexture.textureUVs
			);
		}

		return this;
	}

	// cloneable

	MeshTextured.prototype.clone = function()
	{
		return new MeshTextured
		(
			this.geometry.clone(),
			this.materials,
			( this.faceTextures == null ? null : this.faceTextures.clone() ),
			( this.vertexGroups == null ? null : this.vertexGroups.clone() )
		);
	}

	MeshTextured.prototype.overwriteWith = function(other)
	{
		this.geometry.overwriteWith(other.geometry);
		// todo
		return this;
	}
}

function MeshTexturedFaceTexture(materialName, textureUVs)
{
	this.materialName = materialName;
	this.textureUVs = textureUVs;
}
{
	MeshTexturedFaceTexture.prototype.clone = function()
	{
		return new MeshTexturedFaceTexture
		(
			this.materialName, this.textureUVs.clone()
		);
	}
}
