"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_Overwrite {
            constructor(transformableToOverwriteWith) {
                this.transformableToOverwriteWith = transformableToOverwriteWith;
            }
            overwriteWith(other) {
                return this; // todo
            }
            transform(transformable) {
                // todo
                //transformable.overwriteWith(this.transformableToOverwriteWith);
                return this;
            }
            transformCoords(coordsToTransform) {
                return coordsToTransform;
            }
        }
        GameFramework.Transform_Overwrite = Transform_Overwrite;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
