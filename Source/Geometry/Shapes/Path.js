"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Path {
            constructor(points) {
                this.points = points;
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
