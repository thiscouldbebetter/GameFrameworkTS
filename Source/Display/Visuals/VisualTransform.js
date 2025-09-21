"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualTransform extends GameFramework.VisualBase {
            constructor(transformToApply, child) {
                super();
                this.transformToApply = transformToApply;
                this.child = child;
                this._childTransformed = child.clone();
            }
            static fromTransformAndChild(transformToApply, child) {
                return new VisualTransform(transformToApply, child);
            }
            // Cloneable.
            clone() {
                return new VisualTransform(this.transformToApply, this.child.clone());
            }
            overwriteWith(other) {
                this.child.overwriteWith(other.child);
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                transformToApply.transform(this.child);
                return this;
            }
            // Visual.
            initialize(uwpe) {
                this.child.initialize(uwpe);
            }
            initializeIsComplete(uwpe) {
                return this.child.initializeIsComplete(uwpe);
            }
            draw(uwpe, display) {
                this._childTransformed.overwriteWith(this.child);
                this.transformToApply.transform(this._childTransformed);
                this._childTransformed.draw(uwpe, display);
            }
        }
        GameFramework.VisualTransform = VisualTransform;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
