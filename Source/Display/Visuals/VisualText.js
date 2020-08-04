"use strict";
class VisualText {
    constructor(text, colorFill, colorBorder) {
        this._text = text;
        this.colorFill = colorFill;
        this.colorBorder = colorBorder;
    }
    draw(universe, world, place, entity, display) {
        var text = this.text(universe, world, display, entity);
        display.drawText(text, display.fontHeightInPixels, entity.locatable().loc.pos, (this.colorFill == null ? null : this.colorFill.systemColor()), (this.colorBorder == null ? null : this.colorBorder.systemColor()), false, // areColorsReversed
        true, // isCentered
        null // widthMaxInPixels
        );
    }
    ;
    text(universe, world, display, entity) {
        return this._text.get();
    }
    ;
    // Clonable.
    clone() {
        return this; // todo
    }
    overwriteWith(other) {
        return this; // todo
    }
    // transformable
    transform(transformToApply) {
        return this; // todo
    }
}
