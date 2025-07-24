"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeGroupAll extends GameFramework.ShapeBase {
            constructor(children) {
                super();
                this.children = children;
            }
            static fromChildren(children) {
                return new ShapeGroupAll(children);
            }
            // Clonable.
            clone() {
                return new ShapeGroupAll(GameFramework.ArrayHelper.clone(this.children));
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
            containsPoint(pointToCheck) {
                var doAnyChildShapesNotContainPoint = this.children.some(x => x.containsPoint(pointToCheck) == false);
                var doAllChildShapesContainPoint = (doAnyChildShapesNotContainPoint == false);
                return doAllChildShapesContainPoint;
            }
            // Transformable.
            transform(transformToApply) {
                this.children.forEach((x) => x.transform(transformToApply));
                return this;
            }
        }
        GameFramework.ShapeGroupAll = ShapeGroupAll;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
