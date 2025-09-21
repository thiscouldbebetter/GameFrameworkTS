"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Drawable extends GameFramework.EntityPropertyBase {
            constructor(visual, renderingOrder, hidden) {
                super();
                this.visual = visual;
                this.renderingOrder = renderingOrder || 0;
                this.hidden = hidden || false;
            }
            static default() {
                // For rapid prototyping.
                return Drawable.fromVisual(GameFramework.VisualRectangle.default());
            }
            static entitiesFromPlace(place) {
                return place.entitiesByPropertyName(Drawable.name);
            }
            static fromVisual(visual) {
                return new Drawable(visual, null, null);
            }
            static fromVisualAndHidden(visual, hidden) {
                return new Drawable(visual, null, hidden);
            }
            static fromVisualAndRenderingOrder(visual, renderingOrder) {
                return new Drawable(visual, renderingOrder, null);
            }
            static of(entity) {
                return entity.propertyByName(Drawable.name);
            }
            draw(uwpe) {
                if (this.visible()) {
                    this.visual.draw(uwpe, uwpe.universe.display);
                }
            }
            hiddenSet(value) {
                this.hidden = value;
                return this;
            }
            hide() {
                this.hidden = true;
                return this;
            }
            renderingOrderSet(value) {
                this.renderingOrder = value;
                return this;
            }
            show() {
                this.hidden = false;
                return this;
            }
            visible() {
                return (this.hidden == false);
            }
            visualSet(value) {
                this.visual = value;
                return this;
            }
            // EntityProperty.
            updateForTimerTick(uwpe) {
                this.draw(uwpe);
            }
            // Clonable.
            clone() {
                return new Drawable(this.visual, this.renderingOrder, this.hidden);
            }
            overwriteWith(other) {
                this.visual.overwriteWith(other.visual);
                this.renderingOrder = other.renderingOrder;
                this.hidden = other.hidden;
                return this;
            }
        }
        GameFramework.Drawable = Drawable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
