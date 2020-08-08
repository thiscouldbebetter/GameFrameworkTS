"use strict";
class VisualPolygon {
    constructor(verticesAsPath, colorFill, colorBorder) {
        this.verticesAsPath = verticesAsPath;
        this.colorFill = colorFill;
        this.colorBorder = colorBorder;
        this.verticesAsPathTransformed = this.verticesAsPath.clone();
        this.transformTranslate = new Transform_Translate(new Coords(0, 0, 0));
    }
    draw(universe, world, place, entity, display) {
        var drawablePos = entity.locatable().loc.pos;
        this.transformTranslate.displacement.overwriteWith(drawablePos);
        this.verticesAsPathTransformed.overwriteWith(this.verticesAsPath);
        Transforms.applyTransformToCoordsMany(this.transformTranslate, this.verticesAsPathTransformed.points);
        display.drawPolygon(this.verticesAsPathTransformed.points, Color.systemColorGet(this.colorFill), Color.systemColorGet(this.colorBorder));
    }
    ;
    // Clonable.
    clone() {
        return new VisualPolygon(this.verticesAsPath.clone(), ClonableHelper.clone(this.colorFill), ClonableHelper.clone(this.colorBorder));
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
