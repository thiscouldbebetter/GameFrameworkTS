"use strict";
class VisualNone {
    draw(universe, world, place, entity, display) {
        // do nothing
    }
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
VisualNone.Instance = new VisualNone();
