"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_Multiple {
            constructor(transforms) {
                this.transforms = transforms;
            }
            clone() {
                return new Transform_Multiple(this.transforms); // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
            transform(transformable) {
                for (var i = 0; i < this.transforms.length; i++) {
                    var transform = this.transforms[i];
                    //transform.transform(transformable);
                    transformable.transform(transform);
                }
                return transformable;
            }
            transformCoords(coordsToTransform) {
                for (var i = 0; i < this.transforms.length; i++) {
                    var transform = this.transforms[i];
                    transform.transformCoords(coordsToTransform);
                }
                return coordsToTransform;
            }
        }
        GameFramework.Transform_Multiple = Transform_Multiple;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
