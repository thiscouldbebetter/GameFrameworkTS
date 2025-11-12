"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class MeshTextured extends GameFramework.Mesh {
            constructor(center, vertexOffsets, faceBuilders, materials, faceTextures, vertexGroups) {
                super(center, vertexOffsets, faceBuilders);
                this.materials = materials;
                this.materialsByName = GameFramework.ArrayHelper.addLookupsByName(this.materials);
                this.faceTextures = faceTextures;
                this.vertexGroups = vertexGroups;
            }
            static fromGeometryMaterialsAndFaceTextures(geometry, materials, faceTextures) {
                return new MeshTextured(geometry.center, geometry.vertexOffsets, geometry.faceBuilders, materials, faceTextures, null);
            }
            static fromMeshAndMaterials(geometry, materials) {
                return new MeshTextured(geometry.center, geometry.vertexOffsets, geometry.faceBuilders, materials, null, null);
            }
            faces() {
                if (this._faces == null) {
                    var geometryFaces = super.faces();
                    this._faces = [];
                    for (var i = 0; i < geometryFaces.length; i++) {
                        var geometryFace = geometryFaces[i];
                        var vertices = geometryFace.vertices;
                        var faceTexture = this.faceTextures[i];
                        var faceMaterialName = faceTexture.materialName;
                        var faceMaterial = this.materialsByName.get(faceMaterialName);
                        var face = new GameFramework.FaceTextured(vertices, faceMaterial);
                        this._faces.push(face);
                    }
                }
                return this._faces;
            }
            faceTexturesBuild() {
                var materialName = this.materials[0].name;
                var faceTextures = [];
                var numberOfFaces = this.faceBuilders.length;
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
                super.transform(transformToApply);
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
                var center = this.center.clone();
                var vertexOffsets = this.vertexOffsets.map(x => x.clone());
                var faceBuilders = this.faceBuilders.map(x => x.clone());
                var faceTextures = this.faceTextures.map(x => x.clone());
                var vertexGroups = this.vertexGroups == null ? null : this.vertexGroups.map(x => x.clone());
                return new MeshTextured(center, vertexOffsets, faceBuilders, this.materials, faceTextures, vertexGroups);
            }
            overwriteWith(other) {
                super.overwriteWith(other);
                // todo
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.MeshTextured = MeshTextured;
        class MeshTexturedFaceTexture {
            constructor(materialName, textureUvs) {
                this.materialName = materialName;
                this.textureUVs = textureUvs;
            }
            static fromMaterialNameAndTextureUvs(materialName, textureUvs) {
                return new MeshTexturedFaceTexture(materialName, textureUvs);
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
