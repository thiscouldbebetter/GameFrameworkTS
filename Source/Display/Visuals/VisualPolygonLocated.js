"use strict";
class VisualPolygonLocated {
    constructor(verticesAsPath, colorFill, colorBorder) {
        this.verticesAsPath = verticesAsPath;
        this.colorFill = colorFill;
        this.colorBorder = colorBorder;
        this.verticesAsPathTransformed = this.verticesAsPath.clone();
        this.transformLocate = new Transform_Locate(new Disposition(new Coords(0, 0, 0), null, null));
    }
    draw(universe, world, place, entity, display) {
        var drawableLoc = entity.locatable().loc;
        var loc = this.transformLocate.loc;
        loc.overwriteWith(drawableLoc);
        this.verticesAsPathTransformed.overwriteWith(this.verticesAsPath);
        Transforms.applyTransformToCoordsMany(this.transformLocate, this.verticesAsPathTransformed.points);
        display.drawPolygon(this.verticesAsPathTransformed.points, this.colorFill, this.colorBorder);
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
