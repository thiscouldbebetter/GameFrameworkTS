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
            static default() {
                // For rapid prototyping.
                return Drawable.fromVisual(GameFramework.VisualRectangle.default());
            }
            static fromVisual(visual) {
                return new Drawable(visual, null);
            }
            static fromVisualAndIsVisible(visual, isVisible) {
                return new Drawable(visual, isVisible);
            }
            hide() {
                this.isVisible = false;
            }
            show() {
                this.isVisible = true;
            }
            // EntityProperty.
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
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Drawable = Drawable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
