"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_RotateRight {
            constructor(quarterTurnsToRotate) {
                this.quarterTurnsToRotate = quarterTurnsToRotate;
            }
            overwriteWith(other) {
                this.quarterTurnsToRotate = other.quarterTurnsToRotate;
                return this;
            }
            transform(transformable) {
                return transformable.transform(this);
            }
            transformCoords(coordsToTransform) {
                for (var i = 0; i < this.quarterTurnsToRotate; i++) {
                    var temp = coordsToTransform.x;
                    coordsToTransform.x = 0 - coordsToTransform.y;
                    coordsToTransform.y = temp;
                }
                return coordsToTransform;
            }
        }
        GameFramework.Transform_RotateRight = Transform_RotateRight;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
