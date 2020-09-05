"use strict";
class VisualRotate {
    constructor(rotationInTurns, child) {
        this.rotationInTurns = rotationInTurns;
        this.child = child;
    }
    draw(universe, world, place, entity, display) {
        display.stateSave();
        display.rotateTurnsAroundCenter(this.rotationInTurns, entity.locatable().loc.pos);
        this.child.draw(universe, world, place, entity, display);
        display.stateRestore();
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
