"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_Rotate2D {
            constructor(turnsToRotate) {
                this.turnsToRotate = turnsToRotate;
                this._polar = new GameFramework.Polar(0, 1, 0);
            }
            // Clonable.
            clone() {
                return new Transform_Rotate2D(this.turnsToRotate);
            }
            overwriteWith(other) {
                this.turnsToRotate = other.turnsToRotate;
                return this; // todo
            }
            // Transform.
            transform(transformable) {
                return transformable; // todo
            }
            transformCoords(coordsToTransform) {
                this._polar.fromCoords(coordsToTransform).addToAzimuthInTurns(this.turnsToRotate).wrap().toCoords(coordsToTransform);
                return coordsToTransform;
            }
        }
        GameFramework.Transform_Rotate2D = Transform_Rotate2D;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
