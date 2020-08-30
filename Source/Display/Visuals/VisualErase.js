"use strict";
class VisualErase {
    constructor(child) {
        this.child = child;
    }
    draw(universe, world, place, entity, display) {
        display.eraseModeSet(true);
        this.child.draw(universe, world, place, entity, display);
        display.eraseModeSet(false);
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
