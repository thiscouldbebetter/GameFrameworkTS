"use strict";
class MeshTextured {
    constructor(geometry, materials, faceTextures, vertexGroups) {
        this.geometry = geometry;
        this.materials = materials;
        this.materialsByName = ArrayHelper.addLookupsByName(this.materials);
        this.faceTextures = faceTextures;
        this.vertexGroups = vertexGroups;
    }
    faces() {
        if (this._faces == null) {
            this._faces = [];
            var geometryFaces = this.geometry.faces();
            for (var i = 0; i < geometryFaces.length; i++) {
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
    ;
    faceTexturesBuild() {
        var materialName = this.materials[0].name;
        var faceTextures = [];
        var numberOfFaces = this.geometry.faceBuilders.length;
        for (var f = 0; f < numberOfFaces; f++) {
            var faceTexture = new MeshTexturedFaceTexture(materialName, [
                new Coords(0, 0, 0),
                new Coords(1, 0, 0),
                new Coords(1, 1, 0),
                new Coords(1, 0, 0)
            ]);
            faceTextures.push(faceTexture);
        }
        this.faceTextures = faceTextures;
        return this;
    }
    ;
    faceIndicesByMaterialName() {
        if (this._faceIndicesByMaterialName == null) {
            this._faceIndicesByMaterialName = new Map();
            for (var f = 0; f < this.faceTextures.length; f++) {
                var faceTexture = this.faceTextures[f];
                var faceMaterialName = faceTexture.materialName;
                var faceIndicesForMaterial = this._faceIndicesByMaterialName.get(faceMaterialName);
                if (faceIndicesForMaterial == null) {
                    faceIndicesForMaterial = [];
                    this._faceIndicesByMaterialName.set(faceMaterialName, faceIndicesForMaterial);
                }
                faceIndicesForMaterial.push(f);
            }
        }
        return this._faceIndicesByMaterialName;
    }
    ;
    transform(transformToApply) {
        this.geometry.transform(transformToApply);
        return this;
    }
    ;
    transformFaceTextures(transformToApply) {
        for (var i = 0; i < this.faceTextures.length; i++) {
            var faceTexture = this.faceTextures[i];
            faceTexture.transform(transformToApply);
        }
        return this;
    }
    ;
    // cloneable
    clone() {
        return new MeshTextured(this.geometry.clone(), this.materials, (this.faceTextures == null ? null : ArrayHelper.clone(this.faceTextures)), (this.vertexGroups == null ? null : ArrayHelper.clone(this.vertexGroups)));
    }
    ;
    overwriteWith(other) {
        this.geometry.overwriteWith(other.geometry);
        // todo
        return this;
    }
    ;
}
class MeshTexturedFaceTexture {
    constructor(materialName, textureUVs) {
        this.materialName = materialName;
        this.textureUVs = textureUVs;
    }
    clone() {
        return new MeshTexturedFaceTexture(this.materialName, ArrayHelper.clone(this.textureUVs));
    }
    ;
    // Transformable.
    transform(transformToApply) {
        for (var i = 0; i < this.textureUVs.length; i++) {
            var textureUV = this.textureUVs[i];
            transformToApply.transformCoords(textureUV);
        }
        return this;
    }
    ;
}
