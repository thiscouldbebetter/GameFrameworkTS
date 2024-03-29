"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_MeshPoseWithSkeleton {
            constructor(meshAtRest, skeletonAtRest, boneInfluences, skeletonPosed) {
                this.meshAtRest = meshAtRest;
                this.skeletonAtRest = skeletonAtRest;
                this.skeletonPosed = skeletonPosed || this.skeletonAtRest.clone();
                this.boneInfluences = boneInfluences;
                this.boneInfluencesByName = GameFramework.ArrayHelper.addLookups(this.boneInfluences, (x) => x.boneName);
                // Helper variables.
                this._orientation = new GameFramework.Orientation(GameFramework.Coords.create(), GameFramework.Coords.create());
                this._vertex = GameFramework.Coords.create();
            }
            clone() {
                return this;
            }
            overwriteWith(other) {
                return this; // todo
            }
            transform(transformable) {
                this.transformMesh(transformable);
                return transformable;
            }
            transformCoords(coordsToTransform) {
                return coordsToTransform;
            }
            transformMesh(meshToPose) {
                var meshAtRestVertices = this.meshAtRest.geometry.vertexOffsets;
                var meshToPoseVertices = meshToPose.geometry.vertexOffsets;
                var bonesAtRest = this.skeletonAtRest.bonesAllByName;
                var bonesPosed = this.skeletonPosed.bonesAllByName;
                for (var i = 0; i < this.boneInfluences.length; i++) {
                    var boneInfluence = this.boneInfluences[i];
                    var boneName = boneInfluence.boneName;
                    var boneAtRest = bonesAtRest.get(boneName);
                    var bonePosed = bonesPosed.get(boneName);
                    var boneAtRestOrientation = boneAtRest.orientation;
                    var vertexIndicesControlled = boneInfluence.vertexIndicesControlled;
                    for (var vi = 0; vi < vertexIndicesControlled.length; vi++) {
                        var vertexIndex = vertexIndicesControlled[vi];
                        var vertexAtRest = meshAtRestVertices[vertexIndex];
                        var vertexToPose = meshToPoseVertices[vertexIndex];
                        var boneAtRestPos = boneAtRest.pos(bonesAtRest);
                        var bonePosedPos = bonePosed.pos(bonesPosed);
                        var vertexAtRestProjected = this._vertex.overwriteWith(vertexAtRest).subtract(boneAtRestPos);
                        vertexAtRestProjected.overwriteWithDimensions(vertexAtRestProjected.dotProduct(boneAtRestOrientation.right), vertexAtRestProjected.dotProduct(boneAtRestOrientation.down), vertexAtRestProjected.dotProduct(boneAtRestOrientation.forward));
                        vertexToPose.overwriteWith(bonePosedPos);
                        var bonePosedOrientation = this._orientation.overwriteWith(bonePosed.orientation);
                        vertexToPose.add(bonePosedOrientation.right.multiplyScalar(vertexAtRestProjected.x)).add(bonePosedOrientation.down.multiplyScalar(vertexAtRestProjected.y)).add(bonePosedOrientation.forward.multiplyScalar(vertexAtRestProjected.z));
                    }
                } // end for each boneInfluence
            }
        }
        GameFramework.Transform_MeshPoseWithSkeleton = Transform_MeshPoseWithSkeleton;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
