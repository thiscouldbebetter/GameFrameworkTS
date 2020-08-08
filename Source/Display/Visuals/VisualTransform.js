"use strict";
class VisualTransform {
    constructor(transformToApply, child) {
        this.transformToApply = transformToApply;
        this.child = child;
        this._childTransformed = child.clone();
    }
    // Cloneable.
    clone() {
        return new VisualTransform(this.transformToApply, this.child.clone());
    }
    ;
    overwriteWith(other) {
        var otherAsVisualTransform = other;
        this.child.overwriteWith(otherAsVisualTransform.child);
        return this;
    }
    ;
    // Transformable.
    transform(transformToApply) {
        return this.child.transform(transformToApply);
    }
    ;
    // Visual.
    draw(universe, world, place, entity, display) {
        this._childTransformed.overwriteWith(this.child);
        this.transformToApply.transform(this._childTransformed);
        this._childTransformed.draw(universe, world, place, entity, display);
    }
    ;
}
