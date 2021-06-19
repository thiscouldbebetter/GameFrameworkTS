"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualTransform {
            constructor(transformToApply, child) {
                this.transformToApply = transformToApply;
                this.child = child;
                this._childTransformed = child.clone();
            }
            // Cloneable.
            clone() {
                return new VisualTransform(this.transformToApply, this.child.clone());
            }
            overwriteWith(other) {
                var otherAsVisualTransform = other;
                this.child.overwriteWith(otherAsVisualTransform.child);
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                return this.child.transform(transformToApply);
            }
            // Visual.
            draw(uwpe, display) {
                this._childTransformed.overwriteWith(this.child);
                this.transformToApply.transform(this._childTransformed);
                this._childTransformed.draw(uwpe, display);
            }
        }
        GameFramework.VisualTransform = VisualTransform;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
