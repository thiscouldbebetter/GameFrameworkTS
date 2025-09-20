"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_Dynamic {
            constructor(transformTransformable) {
                this.transformTransformable = transformTransformable;
            }
            static fromTransformTransformable(transformTransformable) {
                return new Transform_Dynamic(transformTransformable);
            }
            // Clonable.
            clone() { return this; } // todo
            overwriteWith(other) {
                return this;
            }
            // TransformBase.
            transform(transformable) {
                return this.transformTransformable(transformable);
            }
            transformCoords(coordsToTransform) {
                return coordsToTransform; // todo
            }
        }
        GameFramework.Transform_Dynamic = Transform_Dynamic;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
