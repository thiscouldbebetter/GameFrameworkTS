"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualHidable {
            constructor(isVisible, child) {
                this._isVisible = isVisible;
                this.child = child;
            }
            isVisible(uwpe) {
                return this._isVisible(uwpe);
            }
            // Clonable.
            clone() {
                return new VisualHidable(this._isVisible, this.child.clone());
            }
            overwriteWith(other) {
                this._isVisible = other._isVisible;
                this.child = other.child;
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
            // Visual.
            initialize(uwpe) {
                this.child.initialize(uwpe);
            }
            draw(uwpe, display) {
                var isVisible = this.isVisible(uwpe);
                if (isVisible) {
                    this.child.draw(uwpe, display);
                }
            }
        }
        GameFramework.VisualHidable = VisualHidable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
