"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualImageScaledPartial {
            constructor(regionToDrawAsBox, sizeToDraw, visualImageToExtractFrom) {
                this.visualImageToExtractFrom = visualImageToExtractFrom;
                this.regionToDrawAsBox = regionToDrawAsBox;
                this.sizeToDraw = sizeToDraw;
                this.sizeToDrawHalf = this.sizeToDraw.clone().half();
                this._posSaved = GameFramework.Coords.create();
            }
            static manyFromVisualImageAndSizes(visualImage, imageSizeInPixels, imageSizeInTiles, sizeToScaleTo) {
                var returnVisuals = new Array();
                var tileSizeInPixels = imageSizeInPixels.clone().divide(imageSizeInTiles);
                var sourcePosInTiles = GameFramework.Coords.create();
                for (var y = 0; y < imageSizeInTiles.y; y++) {
                    sourcePosInTiles.y = y;
                    for (var x = 0; x < imageSizeInTiles.x; x++) {
                        sourcePosInTiles.x = x;
                        var sourcePosInPixels = sourcePosInTiles.clone().multiply(tileSizeInPixels);
                        var sourceBox = GameFramework.BoxAxisAligned.fromMinAndSize(sourcePosInPixels, tileSizeInPixels);
                        var visual = new VisualImageScaledPartial(sourceBox, sizeToScaleTo, visualImage);
                        returnVisuals.push(visual);
                    }
                }
                return returnVisuals;
            }
            // Visual.
            initialize(uwpe) {
                this.visualImageToExtractFrom.initialize(uwpe);
            }
            initializeIsComplete(uwpe) {
                return this.visualImageToExtractFrom.initializeIsComplete(uwpe);
            }
            draw(uwpe, display) {
                var universe = uwpe.universe;
                var entity = uwpe.entity;
                var image = this.visualImageToExtractFrom.image(universe);
                var entityPos = GameFramework.Locatable.of(entity).loc.pos;
                this._posSaved.overwriteWith(entityPos);
                entityPos.subtract(this.sizeToDrawHalf);
                display.drawImagePartialScaled(image, entityPos, this.regionToDrawAsBox, this.sizeToDraw);
                entityPos.overwriteWith(this._posSaved);
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
        GameFramework.VisualImageScaledPartial = VisualImageScaledPartial;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
