"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_RotateLeft {
            constructor(quarterTurnsToRotate) {
                this.quarterTurnsToRotate = quarterTurnsToRotate;
            }
            static fromQuarterTurnsToRotate(quarterTurnsToRotate) {
                return new Transform_RotateLeft(quarterTurnsToRotate);
            }
            // Clonable.
            clone() {
                return new Transform_RotateLeft(this.quarterTurnsToRotate);
            }
            overwriteWith(other) {
                this.quarterTurnsToRotate = other.quarterTurnsToRotate;
                return this;
            }
            // Transform.
            transform(transformable) {
                return transformable.transform(this);
            }
            transformCoords(coordsToTransform) {
                for (var i = 0; i < this.quarterTurnsToRotate; i++) {
                    var temp = coordsToTransform.x;
                    coordsToTransform.x = coordsToTransform.y;
                    coordsToTransform.y = 0 - temp;
                }
                return coordsToTransform;
            }
        }
        GameFramework.Transform_RotateLeft = Transform_RotateLeft;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
