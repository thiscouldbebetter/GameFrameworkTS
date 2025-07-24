"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class MeshTextured extends GameFramework.ShapeBase {
            constructor(geometry, materials, faceTextures, vertexGroups) {
                super();
                this.geometry = geometry;
                this.materials = materials;
                this.materialsByName = GameFramework.ArrayHelper.addLookupsByName(this.materials);
                this.faceTextures = faceTextures;
                this.vertexGroups = vertexGroups;
            }
            static fromMeshAndMaterials(geometry, materials) {
                return new MeshTextured(geometry, materials, null, null);
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
                        var face = new GameFramework.FaceTextured(geometryFace, faceMaterial);
                        this._faces.push(face);
                    }
                }
                return this._faces;
            }
            faceTexturesBuild() {
                var materialName = this.materials[0].name;
                var faceTextures = [];
                var numberOfFaces = this.geometry.faceBuilders.length;
                for (var f = 0; f < numberOfFaces; f++) {
                    var faceTexture = new MeshTexturedFaceTexture(materialName, [
                        GameFramework.Coords.create(),
                        GameFramework.Coords.fromXY(1, 0),
                        GameFramework.Coords.fromXY(1, 1),
                        GameFramework.Coords.fromXY(1, 0)
                    ]);
                    faceTextures.push(faceTexture);
                }
                this.faceTextures = faceTextures;
                return this;
            }
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
            transform(transformToApply) {
                this.geometry.transform(transformToApply);
                return this;
            }
            transformFaceTextures(transformToApply) {
                for (var i = 0; i < this.faceTextures.length; i++) {
                    var faceTexture = this.faceTextures[i];
                    faceTexture.transform(transformToApply);
                }
                return this;
            }
            // Clonable.
            clone() {
                return new MeshTextured(this.geometry.clone(), this.materials, GameFramework.ArrayHelper.clone(this.faceTextures), GameFramework.ArrayHelper.clone(this.vertexGroups));
            }
            overwriteWith(other) {
                this.geometry.overwriteWith(other.geometry);
                // todo
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.MeshTextured = MeshTextured;
        class MeshTexturedFaceTexture {
            constructor(materialName, textureUVs) {
                this.materialName = materialName;
                this.textureUVs = textureUVs;
            }
            // Clonable.
            clone() {
                return new MeshTexturedFaceTexture(this.materialName, GameFramework.ArrayHelper.clone(this.textureUVs));
            }
            overwriteWith(other) {
                this.materialName = other.materialName;
                GameFramework.ArrayHelper.overwriteWith(this.textureUVs, other.textureUVs);
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                for (var i = 0; i < this.textureUVs.length; i++) {
                    var textureUV = this.textureUVs[i];
                    transformToApply.transformCoords(textureUV);
                }
                return this;
            }
        }
        GameFramework.MeshTexturedFaceTexture = MeshTexturedFaceTexture;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
