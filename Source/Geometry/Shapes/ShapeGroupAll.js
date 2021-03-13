"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeGroupAll {
            constructor(shapes) {
                this.shapes = shapes;
            }
            clone() {
                return new ShapeGroupAll(GameFramework.ArrayHelper.clone(this.shapes));
            }
            overwriteWith(other) {
                GameFramework.ArrayHelper.overwriteWith(this.shapes, other.shapes);
                return this;
            }
        }
        GameFramework.ShapeGroupAll = ShapeGroupAll;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
