"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeTransformed extends GameFramework.ShapeBase {
            constructor(transformToApply, child) {
                super();
                this.transformToApply = transformToApply;
                this.child = child;
                this._childAfterTransformation = this.child.clone();
            }
            static fromTransformAndChild(transformToApply, child) {
                return new ShapeTransformed(transformToApply, child);
            }
            shapeAfterTransformation() {
                var returnValue = this._childAfterTransformation
                    .overwriteWith(this.child)
                    .transform(this.transformToApply);
                return returnValue;
            }
            // Clonable.
            clone() {
                return new ShapeTransformed(this.transformToApply.clone(), this.child.clone());
            }
            overwriteWith(other) {
                this.transformToApply.overwriteWith(other.transformToApply);
                this.child.overwriteWith(other.child);
                return this;
            }
            // Equatable
            equals(other) {
                return this.child.equals(other.child); // todo - && this.transform.equals(other.transform);
            }
            // Transformable.
            transform(transformToApply) {
                this.child.transform(transformToApply); // Is this correct?
                return this;
            }
        }
        GameFramework.ShapeTransformed = ShapeTransformed;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
