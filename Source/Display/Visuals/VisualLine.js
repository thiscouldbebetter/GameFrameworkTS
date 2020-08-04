"use strict";
class VisualLine {
    constructor(fromPos, toPos, color, lineThickness) {
        this.fromPos = fromPos;
        this.toPos = toPos;
        this.color = color;
        this.lineThickness = lineThickness || 1;
        // Helper variables.
        this._drawPosFrom = new Coords(0, 0, 0);
        this._drawPosTo = new Coords(0, 0, 0);
    }
    draw(universe, world, place, entity, display) {
        var pos = entity.locatable().loc.pos;
        var drawPosFrom = this._drawPosFrom.overwriteWith(pos).add(this.fromPos);
        var drawPosTo = this._drawPosTo.overwriteWith(pos).add(this.toPos);
        display.drawLine(drawPosFrom, drawPosTo, this.color.systemColor(), this.lineThickness);
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
