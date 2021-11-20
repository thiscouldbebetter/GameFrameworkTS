"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_TranslateInvert {
            constructor(displacement) {
                this.displacement = displacement;
            }
            clone() {
                return new Transform_TranslateInvert(this.displacement.clone());
            }
            overwriteWith(other) {
                this.displacement.overwriteWith(other.displacement);
                return this;
            }
            transform(transformable) {
                return transformable; // todo
            }
            transformCoords(coordsToTransform) {
                return coordsToTransform.subtract(this.displacement);
            }
        }
        GameFramework.Transform_TranslateInvert = Transform_TranslateInvert;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
