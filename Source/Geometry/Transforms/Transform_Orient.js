"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_Orient {
            constructor(orientation) {
                this.orientation = orientation;
                this._components = [GameFramework.Coords.create(), GameFramework.Coords.create(), GameFramework.Coords.create()];
            }
            clone() {
                return new Transform_Orient(this.orientation.clone());
            }
            overwriteWith(other) {
                this.orientation.overwriteWith(other.orientation);
                return this;
            }
            transform(transformable) {
                return transformable.transform(this);
            }
            transformCoords(coordsToTransform) {
                var components = this._components;
                var ori = this.orientation;
                coordsToTransform.overwriteWith(components[0].overwriteWith(ori.forward).multiplyScalar(coordsToTransform.x).add(components[1].overwriteWith(ori.right).multiplyScalar(coordsToTransform.y).add(components[2].overwriteWith(ori.down).multiplyScalar(coordsToTransform.z))));
                return coordsToTransform;
            }
        }
        GameFramework.Transform_Orient = Transform_Orient;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
