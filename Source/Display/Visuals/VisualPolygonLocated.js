"use strict";
class VisualPolygonLocated {
    constructor(visualPolygon) {
        this.visualPolygon = visualPolygon;
        this.visualPolygonTransformed = this.visualPolygon.clone();
        this.transformLocate = new Transform_Locate(new Disposition(new Coords(0, 0, 0), null, null));
    }
    draw(universe, world, place, entity, display) {
        var drawableLoc = entity.locatable().loc;
        var loc = this.transformLocate.loc;
        loc.overwriteWith(drawableLoc);
        this.visualPolygonTransformed.overwriteWith(this.visualPolygon).transform(this.transformLocate);
        this.visualPolygonTransformed.draw(universe, world, place, entity, display);
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
        this.visualPolygonTransformed.transform(transformToApply);
        return this;
    }
}
