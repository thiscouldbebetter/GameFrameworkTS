"use strict";
class VisualControl {
    constructor(controlRoot) {
        this.controlRoot = controlRoot;
        // Helper variables.
        this._drawLoc = new Disposition(new Coords(0, 0, 0), null, null);
    }
    draw(universe, world, place, entity, display) {
        var display = universe.display;
        var drawLoc = this._drawLoc;
        drawLoc.pos.clear();
        this.controlRoot.draw(universe, display, drawLoc);
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
