"use strict";
class VisualPath {
    constructor(verticesAsPath, color, lineThickness, isClosed) {
        this.verticesAsPath = verticesAsPath;
        this.color = color;
        this.lineThickness = lineThickness;
        this.isClosed = isClosed;
        this.verticesAsPathTransformed = this.verticesAsPath.clone();
        this.transformTranslate = new Transform_Translate(new Coords(0, 0, 0));
    }
    draw(universe, world, display, entity) {
        var drawablePos = entity.locatable().loc.pos;
        this.transformTranslate.displacement.overwriteWith(drawablePos);
        this.verticesAsPathTransformed.overwriteWith(this.verticesAsPath);
        Transforms.applyTransformToCoordsMany(this.transformTranslate, this.verticesAsPathTransformed.points);
        display.drawPath(this.verticesAsPathTransformed.points, this.color.systemColor(), this.lineThickness, this.isClosed);
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
