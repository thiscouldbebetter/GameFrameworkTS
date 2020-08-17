"use strict";
class Hidable extends EntityProperty {
    constructor(isHidden) {
        super();
        this.isHidden = isHidden;
        this._isHiddenPrev = null;
    }
    updateForTimerTick(u, w, p, entity) {
        if (this.isHidden != this._isHiddenPrev) {
            this._isHiddenPrev = this.isHidden;
            if (this.isHidden) {
                entity.drawable().isVisible = false;
                if (entity.usable() != null) {
                    entity.usable().isDisabled = true;
                }
            }
            else {
                entity.drawable().isVisible = true;
                if (entity.usable() != null) {
                    entity.usable().isDisabled = false;
                }
            }
        }
    }
    // Clonable.
    clone() {
        return new Hidable(this.isHidden);
    }
    overwriteWith(other) {
        this.isHidden = other.isHidden;
        return this;
    }
}
