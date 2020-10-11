"use strict";
class VisualText {
    constructor(text, shouldTextContextBeReset, heightInPixels, colorFill, colorBorder) {
        this._text = text;
        this.shouldTextContextBeReset = shouldTextContextBeReset || false;
        this.heightInPixels = heightInPixels || 10;
        this.colorFill = colorFill;
        this.colorBorder = colorBorder;
        this._universeWorldPlaceEntities = UniverseWorldPlaceEntities.create();
    }
    static fromTextAndColor(text, colorFill) {
        return new VisualText(DataBinding.fromContext(text), false, // shouldTextContextBeReset
        null, // heightInPixels
        colorFill, null // colorBorder
        );
    }
    draw(universe, world, place, entity, display) {
        var text = this.text(universe, world, place, entity, display);
        display.drawText(text, this.heightInPixels, entity.locatable().loc.pos, Color.systemColorGet(this.colorFill), Color.systemColorGet(this.colorBorder), false, // areColorsReversed
        true, // isCentered
        null // widthMaxInPixels
        );
    }
    text(universe, world, place, entity, display) {
        if (this.shouldTextContextBeReset) {
            this._universeWorldPlaceEntities.fieldsSet(universe, world, place, entity, null);
            this._text.contextSet(this._universeWorldPlaceEntities);
        }
        var returnValue = this._text.get();
        return returnValue;
    }
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
