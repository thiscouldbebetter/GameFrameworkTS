"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VertexGroup {
            constructor(name, vertexIndices) {
                this.name = name;
                this.vertexIndices = vertexIndices;
            }
            // Clonable.
            clone() {
                return new VertexGroup(this.name, this.vertexIndices.slice());
            }
            overwriteWith(other) {
                this.name = other.name;
                GameFramework.ArrayHelper.overwriteWithNonClonables(this.vertexIndices, other.vertexIndices);
                return this;
            }
        }
        GameFramework.VertexGroup = VertexGroup;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
