"use strict";
class VisualTransform {
    constructor(transformToApply, child) {
        this.transformToApply = transformToApply;
        this.child = child;
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
    draw(universe, world, display, entity) {
        this.child.transform(this.transformToApply);
        this.child.draw(universe, world, display, entity);
    }
    ;
}
