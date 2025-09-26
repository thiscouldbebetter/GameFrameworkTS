"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeGroupAny extends GameFramework.ShapeBase {
            constructor(children) {
                super();
                this.children = children;
                this._displacement = GameFramework.Coords.create();
                this._surfacePointForChild = GameFramework.Coords.create();
            }
            static fromChildren(children) {
                return new ShapeGroupAny(children);
            }
            // Clonable.
            clone() {
                return new ShapeGroupAny(GameFramework.ArrayHelper.clone(this.children));
            }
            overwriteWith(other) {
                GameFramework.ArrayHelper.overwriteWith(this.children, other.children);
                return this;
            }
            // Equatable.
            equals(other) {
                var thisAndOtherAreEqualSoFar = (this.children.length == other.children.length);
                if (thisAndOtherAreEqualSoFar) {
                    for (var i = 0; i < this.children.length; i++) {
                        var childOfThis = this.children[i];
                        var childOfOther = other.children[i];
                        var childrenOfThisAndOtherAreEqual = childOfThis.equals(childOfOther);
                        if (childrenOfThisAndOtherAreEqual == false) {
                            thisAndOtherAreEqualSoFar = false;
                            break;
                        }
                    }
                }
                return thisAndOtherAreEqualSoFar;
            }
            // ShapeBase.
            surfacePointNearPos(posToCheck, surfacePointOut) {
                var distanceMinSoFar = Number.POSITIVE_INFINITY;
                for (var i = 0; i < this.children.length; i++) {
                    var shape = this.children[i];
                    shape.surfacePointNearPos(posToCheck, this._surfacePointForChild);
                    var distanceFromPosToCheck = this._displacement.overwriteWith(this._surfacePointForChild).subtract(posToCheck).magnitude();
                    if (distanceFromPosToCheck < distanceMinSoFar) {
                        distanceMinSoFar = distanceFromPosToCheck;
                        surfacePointOut.overwriteWith(this._surfacePointForChild);
                    }
                }
                return surfacePointOut;
            }
            // Strings.
            toString() {
                var returnValue = ShapeGroupAny.name + " of children " + this.children.map(x => x.toString());
                return returnValue;
            }
            // Transformable.
            transform(transformToApply) {
                this.children.forEach((x) => x.transform(transformToApply));
                return this;
            }
        }
        GameFramework.ShapeGroupAny = ShapeGroupAny;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
