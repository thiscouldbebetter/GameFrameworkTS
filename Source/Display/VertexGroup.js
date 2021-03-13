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
            // cloneable
            clone() {
                return new VertexGroup(this.name, this.vertexIndices.slice());
            }
        }
        GameFramework.VertexGroup = VertexGroup;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
