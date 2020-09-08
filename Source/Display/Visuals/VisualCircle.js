"use strict";
class VisualCircle {
    constructor(radius, colorFill, colorBorder, borderThickness) {
        this.radius = radius;
        this.colorFill = colorFill;
        this.colorBorder = colorBorder;
        this.borderThickness = borderThickness || 1;
    }
    draw(universe, world, place, entity, display) {
        display.drawCircle(entity.locatable().loc.pos, this.radius, Color.systemColorGet(this.colorFill), Color.systemColorGet(this.colorBorder), this.borderThickness);
    }
    ;
    // Clonable.
    clone() {
        return new VisualCircle(this.radius, this.colorFill, this.colorBorder, this.borderThickness);
    }
    overwriteWith(otherAsVisual) {
        var other = otherAsVisual;
        this.radius = other.radius;
        this.colorFill = other.colorFill;
        this.colorBorder = other.colorBorder;
        this.borderThickness = other.borderThickness;
        return this; // todo
    }
    // Transformable.
    transform(transformToApply) {
        return this; // todo
    }
}
