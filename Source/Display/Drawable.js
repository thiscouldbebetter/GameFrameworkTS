"use strict";
class Drawable extends EntityProperty {
    constructor(visual, isVisible) {
        super();
        this.visual = visual;
        this.isVisible = (isVisible == null ? true : isVisible);
    }
    animatable() {
        if (this._animatable == null) {
            this._animatable = new DrawableAnimatable();
        }
        return this._animatable;
    }
    updateForTimerTick(universe, world, place, entity) {
        if (this.isVisible) {
            this.visual.draw(universe, world, place, entity, universe.display);
        }
    }
    // cloneable
    clone() {
        return new Drawable(this.visual, this.isVisible);
    }
}
