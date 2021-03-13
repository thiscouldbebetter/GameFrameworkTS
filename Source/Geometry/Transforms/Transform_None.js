"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_None {
            constructor() { }
            overwriteWith(other) {
                return this;
            }
            transform(transformable) {
                return transformable;
            }
            transformCoords(coordsToTransform) {
                return coordsToTransform;
            }
        }
        GameFramework.Transform_None = Transform_None;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
