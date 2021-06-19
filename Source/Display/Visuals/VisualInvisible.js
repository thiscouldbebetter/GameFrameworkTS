"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualInvisible {
            constructor(child) {
                this.child = child;
            }
            // Cloneable.
            clone() {
                return new VisualInvisible(this.child.clone());
            }
            overwriteWith(other) {
                var otherAsVisualInvisible = other;
                this.child.overwriteWith(otherAsVisualInvisible.child);
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                transformToApply.transform(this.child);
                return this;
            }
            // Visual.
            draw(uwpe, display) {
                // Do nothing.
            }
        }
        GameFramework.VisualInvisible = VisualInvisible;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
