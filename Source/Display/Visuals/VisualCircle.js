"use strict";
class VisualCircle {
    constructor(radius, colorFill, colorBorder) {
        this.radius = radius;
        this.colorFill = colorFill;
        this.colorBorder = colorBorder;
    }
    draw(universe, world, place, entity, display) {
        display.drawCircle(entity.locatable().loc.pos, this.radius, (this.colorFill == null ? null : this.colorFill.systemColor()), (this.colorBorder == null ? null : this.colorBorder.systemColor()));
    }
    ;
    // Clonable.
    clone() {
        return new VisualCircle(this.radius, this.colorFill, this.colorBorder);
    }
    overwriteWith(other) {
        var otherAsVisualCircle = other;
        this.radius = otherAsVisualCircle.radius;
        this.colorFill = otherAsVisualCircle.colorFill;
        this.colorBorder = otherAsVisualCircle.colorBorder;
        return this; // todo
    }
    // Transformable.
    transform(transformToApply) {
        return this; // todo
    }
}
