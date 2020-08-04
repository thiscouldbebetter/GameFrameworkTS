"use strict";
class VisualDynamic {
    constructor(methodForVisual) {
        this.methodForVisual = methodForVisual;
    }
    draw(universe, world, place, entity, display) {
        var visual = this.methodForVisual.call(this, universe, world, display, entity);
        visual.draw(universe, world, place, entity, display);
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
