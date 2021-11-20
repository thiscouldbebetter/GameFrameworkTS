"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_Translate {
            constructor(displacement) {
                this.displacement = displacement;
            }
            displacementSet(value) {
                this.displacement.overwriteWith(value);
                return this;
            }
            // transform
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
            transform(transformable) {
                return transformable.transform(this);
            }
            transformCoords(coordsToTransform) {
                return coordsToTransform.add(this.displacement);
            }
        }
        GameFramework.Transform_Translate = Transform_Translate;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
