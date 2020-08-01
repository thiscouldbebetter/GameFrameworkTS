"use strict";
class VisualPolygon {
    constructor(verticesAsPath, colorFill, colorBorder) {
        this.verticesAsPath = verticesAsPath;
        this.colorFill = colorFill;
        this.colorBorder = colorBorder;
        this.verticesAsPathTransformed = this.verticesAsPath.clone();
        this.transformTranslate = new Transform_Translate(new Coords(0, 0, 0));
    }
    draw(universe, world, display, entity) {
        var drawablePos = entity.locatable().loc.pos;
        this.transformTranslate.displacement.overwriteWith(drawablePos);
        this.verticesAsPathTransformed.overwriteWith(this.verticesAsPath);
        Transforms.applyTransformToCoordsMany(this.transformTranslate, this.verticesAsPathTransformed.points);
        display.drawPolygon(this.verticesAsPathTransformed.points, (this.colorFill == null ? null : this.colorFill.systemColor()), (this.colorBorder == null ? null : this.colorBorder.systemColor()));
    }
    ;
    // Clonable.
    clone() {
        return new VisualPolygon(this.verticesAsPath.clone(), this.colorFill == null ? null : this.colorFill.clone(), this.colorBorder == null ? null : this.colorBorder.clone());
    }
    overwriteWith(other) {
        var otherAsVisualPolygon = other;
        ArrayHelper.overwriteWith(this.verticesAsPath, otherAsVisualPolygon.verticesAsPath);
        if (this.colorFill != null) {
            this.colorFill.overwriteWith(otherAsVisualPolygon.colorFill);
        }
        if (this.colorBorder != null) {
            this.colorBorder.overwriteWith(otherAsVisualPolygon.colorBorder);
        }
        return this;
    }
    // Transformable.
    transform(transformToApply) {
        this.verticesAsPath.transform(transformToApply);
        return this;
    }
}
