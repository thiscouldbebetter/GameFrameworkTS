"use strict";
class VisualArc {
    constructor(radiusOuter, radiusInner, directionMin, angleSpannedInTurns, colorFill, colorBorder) {
        this.radiusOuter = radiusOuter;
        this.radiusInner = radiusInner;
        this.directionMin = directionMin;
        this.angleSpannedInTurns = angleSpannedInTurns;
        this.colorFill = colorFill;
        this.colorBorder = colorBorder;
        // helper variables
        this._drawPos = new Coords(0, 0, 0);
        this._polar = new Polar(0, 0, 0);
    }
    draw(universe, world, place, entity, display) {
        var drawableLoc = entity.locatable().loc;
        var drawPos = this._drawPos.overwriteWith(drawableLoc.pos);
        var drawableAngleInTurns = drawableLoc.orientation.headingInTurns();
        var wedgeAngleMin = drawableAngleInTurns
            + this._polar.fromCoords(this.directionMin).azimuthInTurns;
        var wedgeAngleMax = wedgeAngleMin + this.angleSpannedInTurns;
        display.drawArc(drawPos, // center
        this.radiusInner, this.radiusOuter, wedgeAngleMin, wedgeAngleMax, (this.colorFill == null ? null : this.colorFill.systemColor()), (this.colorBorder == null ? null : this.colorBorder.systemColor()));
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
