"use strict";
class VisualLine {
    constructor(fromPos, toPos, color) {
        this.fromPos = fromPos;
        this.toPos = toPos;
        this.color = color;
        // Helper variables.
        this.drawPosFrom = new Coords(0, 0, 0);
        this.drawPosTo = new Coords(0, 0, 0);
    }
    draw(universe, world, display, entity) {
        var pos = entity.locatable().loc.pos;
        var drawPosFrom = this.drawPosFrom.overwriteWith(pos).add(this.fromPos);
        var drawPosTo = this.drawPosTo.overwriteWith(pos).add(this.toPos);
        display.drawLine(drawPosFrom, drawPosTo, this.color, null);
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
