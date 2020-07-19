"use strict";
class VisualDynamic {
    constructor(methodForVisual) {
        this.methodForVisual = methodForVisual;
    }
    draw(universe, world, display, entity) {
        var visual = this.methodForVisual.call(this, universe, world, display, entity);
        visual.draw(universe, world, display, entity);
    }
    ;
    // Clonable.
    clone() {
        return this; // todo
    }
    overwriteWith(other) {
        return this; // todo
    }
    // Transformable.
    transform(transformToApply) {
        return this; // todo
    }
}
