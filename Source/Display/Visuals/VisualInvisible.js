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
                return transformToApply.transform(this.child);
            }
            // Visual.
            draw(universe, world, place, entity, display) {
                // Do nothing.
            }
        }
        GameFramework.VisualInvisible = VisualInvisible;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
