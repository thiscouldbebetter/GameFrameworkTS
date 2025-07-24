"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeNone extends GameFramework.ShapeBase {
            static Instance() {
                if (this._instance == null) {
                    this._instance = new ShapeNone();
                }
                return this._instance;
            }
            // Clonable.
            clone() {
                return new ShapeNone();
            }
            overwriteWith(other) {
                return this;
            }
            // Equatable
            equals(other) { return false; }
            // ShapeBase.
            containsPoint(pointToCheck) {
                return false;
            }
            // Transformable.
            transform(transformToApply) { return this; }
        }
        GameFramework.ShapeNone = ShapeNone;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
