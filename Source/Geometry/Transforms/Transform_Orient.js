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
                var componentXForward = components[0]
                    .overwriteWith(ori.forward)
                    .multiplyScalar(coordsToTransform.x);
                var componentYRight = components[1]
                    .overwriteWith(ori.right)
                    .multiplyScalar(coordsToTransform.y);
                var componentZDown = components[2]
                    .overwriteWith(ori.down)
                    .multiplyScalar(coordsToTransform.z);
                coordsToTransform
                    .overwriteWith(componentXForward)
                    .add(componentYRight)
                    .add(componentZDown);
                return coordsToTransform;
            }
        }
        GameFramework.Transform_Orient = Transform_Orient;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
