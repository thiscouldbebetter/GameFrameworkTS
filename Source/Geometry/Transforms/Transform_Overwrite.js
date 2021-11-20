"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_Overwrite {
            constructor(transformableToOverwriteWith) {
                this.transformableToOverwriteWith = transformableToOverwriteWith;
            }
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
            transform(transformable) {
                transformable.overwriteWith(this.transformableToOverwriteWith);
                return transformable;
            }
            transformCoords(coordsToTransform) {
                return coordsToTransform;
            }
        }
        GameFramework.Transform_Overwrite = Transform_Overwrite;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
