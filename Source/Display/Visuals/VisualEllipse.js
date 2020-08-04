"use strict";
class VisualEllipse {
    constructor(semimajorAxis, semiminorAxis, rotationInTurns, colorFill, colorBorder) {
        this.semimajorAxis = semimajorAxis;
        this.semiminorAxis = semiminorAxis;
        this.rotationInTurns = rotationInTurns;
        this.colorFill = colorFill;
        this.colorBorder = colorBorder;
    }
    draw(universe, world, place, entity, display) {
        var drawableLoc = entity.locatable().loc;
        var drawableOrientation = drawableLoc.orientation;
        var drawableRotationInTurns = drawableOrientation.headingInTurns();
        display.drawEllipse(drawableLoc.pos, this.semimajorAxis, this.semiminorAxis, NumberHelper.wrapToRangeZeroOne(this.rotationInTurns + drawableRotationInTurns), (this.colorFill == null ? null : this.colorFill.systemColor()), (this.colorBorder == null ? null : this.colorBorder.systemColor()));
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
