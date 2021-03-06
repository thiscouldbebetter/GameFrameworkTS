"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class BoneInfluence {
            constructor(boneName, vertexIndicesControlled) {
                this.boneName = boneName;
                this.vertexIndicesControlled = vertexIndicesControlled;
            }
            // static methods
            static buildManyForBonesAndVertexGroups(bones, vertexGroups) {
                var boneInfluences = [];
                var bonesByName = GameFramework.ArrayHelper.addLookupsByName(bones);
                for (var i = 0; i < vertexGroups.length; i++) {
                    var vertexGroup = vertexGroups[i];
                    var boneName = vertexGroup.name;
                    var bone = bonesByName.get(boneName);
                    if (bone != null) {
                        var boneInfluence = new BoneInfluence(boneName, vertexGroup.vertexIndices.slice());
                        boneInfluences.push(boneInfluence);
                    }
                }
                return boneInfluences;
            }
        }
        GameFramework.BoneInfluence = BoneInfluence;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
