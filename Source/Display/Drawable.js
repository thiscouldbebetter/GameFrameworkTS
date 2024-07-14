"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Drawable {
            constructor(visual, renderingOrder, isVisible) {
                this.visual = visual;
                this.renderingOrder = renderingOrder || 0;
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
                return new Drawable(visual, null, null);
            }
            static fromVisualAndIsVisible(visual, isVisible) {
                return new Drawable(visual, null, isVisible);
            }
            static fromVisualAndRenderingOrder(visual, renderingOrder) {
                return new Drawable(visual, renderingOrder, null);
            }
            draw(uwpe) {
                if (this.isVisible) {
                    this.visual.draw(uwpe, uwpe.universe.display);
                }
            }
            hide() {
                this.isVisible = false;
            }
            show() {
                this.isVisible = true;
            }
            // EntityProperty.
            propertyName() { return Drawable.name; }
            updateForTimerTick(uwpe) {
                this.draw(uwpe);
            }
            // cloneable
            clone() {
                return new Drawable(this.visual, this.renderingOrder, this.isVisible);
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
