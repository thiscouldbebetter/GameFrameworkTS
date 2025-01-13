"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualImageFromLibrary {
            constructor(imageName) {
                this.imageName = imageName;
                // Helper variables.
                this._drawPos = GameFramework.Coords.create();
            }
            // static methods
            static manyFromImages(images, imageSizeScaled) {
                var returnValues = [];
                for (var i = 0; i < images.length; i++) {
                    var image = images[i];
                    var visual = new VisualImageFromLibrary(image.name);
                    returnValues.push(visual);
                }
                return returnValues;
            }
            // instance methods
            image(universe) {
                return universe.mediaLibrary.imageGetByName(this.imageName);
            }
            sizeInPixels(universe) {
                return this.image(universe).sizeInPixels;
            }
            // Visual.
            initialize(uwpe) {
                var image = this.image(uwpe.universe);
                image.load(uwpe, null);
            }
            initializeIsComplete(uwpe) {
                var image = this.image(uwpe.universe);
                var imageIsLoaded = image.isLoaded;
                return imageIsLoaded;
            }
            draw(uwpe, display) {
                var universe = uwpe.universe;
                var entity = uwpe.entity;
                var image = this.image(universe);
                var imageSize = image.sizeInPixels;
                var drawPos = this._drawPos.clear().subtract(imageSize).half().add(GameFramework.Locatable.of(entity).loc.pos);
                display.drawImageScaled(image, drawPos, imageSize);
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
        GameFramework.VisualImageFromLibrary = VisualImageFromLibrary;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
