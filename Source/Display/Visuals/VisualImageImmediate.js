"use strict";
class VisualImageImmediate {
    constructor(image) {
        this._image = image;
        // Helper variables.
        this._drawPos = new Coords(0, 0, 0);
    }
    // static methods
    static manyFromImages(images) {
        var returnValues = [];
        for (var i = 0; i < images.length; i++) {
            var image = images[i];
            var visual = new VisualImageImmediate(image);
            returnValues.push(visual);
        }
        return returnValues;
    }
    ;
    // instance methods
    image(universe) {
        return this._image;
    }
    ;
    // visual
    draw(universe, world, display, entity) {
        var image = this.image(universe);
        var imageSize = image.sizeInPixels;
        var drawPos = this._drawPos.clear().subtract(imageSize).half().add(entity.locatable().loc.pos);
        //display.drawImageScaled(image, drawPos, imageSize);
        display.drawImage(image, drawPos);
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
