"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Drawable {
            constructor(visual, isVisible) {
                this.visual = visual;
                this.isVisible = isVisible;
                if (this.isVisible == null) {
                    this.isVisible = true;
                }
            }
            static fromVisual(visual) {
                return new Drawable(visual, null);
            }
            static fromVisualAndIsVisible(visual, isVisible) {
                return new Drawable(visual, isVisible);
            }
            updateForTimerTick(uwpe) {
                if (this.isVisible) {
                    this.visual.draw(uwpe, uwpe.universe.display);
                }
            }
            // cloneable
            clone() {
                return new Drawable(this.visual, this.isVisible);
            }
            overwriteWith(other) {
                this.visual.overwriteWith(other.visual);
                this.isVisible = other.isVisible;
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
        }
        GameFramework.Drawable = Drawable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
