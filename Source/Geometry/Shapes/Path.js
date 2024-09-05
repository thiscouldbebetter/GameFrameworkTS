"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Path {
            constructor(points) {
                this.points = points;
            }
            static arrowOfWidthAndLength(width, length) {
                var backOffset = GameFramework.Coords.fromXY(-1, 0).multiplyScalar(length);
                var rightOffset = GameFramework.Coords.fromXY(0, 1).multiplyScalar(width / 2);
                return new Path([
                    GameFramework.Coords.fromXY(0, 0), // tip
                    backOffset.clone().add(rightOffset),
                    backOffset.clone().subtract(rightOffset)
                ]);
            }
            static default() {
                // For rapid prototyping.
                return Path.fromDimension(10);
            }
            static fromDimension(dimension) {
                // For rapid prototyping.
                return new Path([
                    GameFramework.Coords.fromXY(-1, 0).multiplyScalar(dimension),
                    GameFramework.Coords.fromXY(1, 0).multiplyScalar(dimension),
                    GameFramework.Coords.fromXY(0, 1).multiplyScalar(dimension),
                ]);
            }
            // Clonable.
            clone() {
                return new Path(GameFramework.ArrayHelper.clone(this.points));
            }
            overwriteWith(other) {
                GameFramework.ArrayHelper.overwriteWith(this.points, other.points);
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                GameFramework.Transforms.applyTransformToCoordsMany(transformToApply, this.points);
                return this;
            }
        }
        GameFramework.Path = Path;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
