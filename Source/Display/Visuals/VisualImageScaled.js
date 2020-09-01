"use strict";
class VisualImageScaled {
    constructor(visualImage, sizeToDraw) {
        this.visualImage = visualImage;
        this.sizeToDraw = sizeToDraw;
        this.sizeToDrawHalf = this.sizeToDraw.clone().half();
        this._posSaved = new Coords(0, 0, 0);
    }
    static manyFromSizeAndVisuals(sizeToDraw, visualsToScale) {
        var returnValues = [];
        for (var i = 0; i < visualsToScale.length; i++) {
            var visualToScale = visualsToScale[i];
            var visualScaled = new VisualImageScaled(visualToScale, sizeToDraw);
            returnValues.push(visualScaled);
        }
        return returnValues;
    }
    ;
    draw(universe, world, place, entity, display) {
        var image = this.visualImage.image(universe);
        var entityPos = entity.locatable().loc.pos;
        this._posSaved.overwriteWith(entityPos);
        entityPos.subtract(this.sizeToDrawHalf);
        display.drawImageScaled(image, entityPos, this.sizeToDraw);
        entityPos.overwriteWith(this._posSaved);
    }
    image(universe) {
        return this.visualImage.image(universe);
    }
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
