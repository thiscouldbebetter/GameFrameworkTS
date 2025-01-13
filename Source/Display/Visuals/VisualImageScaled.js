"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualImageScaled {
            constructor(sizeToDraw, visualImage) {
                this.sizeToDraw = sizeToDraw;
                this.visualImage = visualImage;
                this.sizeToDrawHalf = this.sizeToDraw.clone().half();
                this._posSaved = GameFramework.Coords.create();
            }
            static manyFromSizeAndVisuals(sizeToDraw, visualsToScale) {
                var returnValues = [];
                for (var i = 0; i < visualsToScale.length; i++) {
                    var visualToScale = visualsToScale[i];
                    var visualScaled = new VisualImageScaled(sizeToDraw, visualToScale);
                    returnValues.push(visualScaled);
                }
                return returnValues;
            }
            // Visual.
            initialize(uwpe) {
                this.visualImage.initialize(uwpe);
            }
            initializeIsComplete(uwpe) {
                return this.visualImage.initializeIsComplete(uwpe);
            }
            draw(uwpe, display) {
                var universe = uwpe.universe;
                var entity = uwpe.entity;
                var image = this.visualImage.image(universe);
                var entityPos = GameFramework.Locatable.of(entity).loc.pos;
                this._posSaved.overwriteWith(entityPos);
                entityPos.subtract(this.sizeToDrawHalf);
                display.drawImageScaled(image, entityPos, this.sizeToDraw);
                entityPos.overwriteWith(this._posSaved);
            }
            image(universe) {
                return this.visualImage.image(universe);
            }
            sizeInPixels(universe) {
                return this.sizeToDraw;
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
        GameFramework.VisualImageScaled = VisualImageScaled;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
