"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualImageImmediate {
            constructor(image, isScaled) {
                this._image = image;
                this.isScaled = isScaled || false;
                // Helper variables.
                this._drawPos = GameFramework.Coords.create();
            }
            // instance methods
            image(universe) {
                return this._image;
            }
            sizeInPixels(universe) {
                return this.image(universe).sizeInPixels;
            }
            // visual
            draw(uwpe, display) {
                var universe = uwpe.universe;
                var entity = uwpe.entity;
                var image = this.image(universe);
                var imageSize = image.sizeInPixels;
                var drawPos = this._drawPos.clear().subtract(imageSize).half().add(entity.locatable().loc.pos);
                if (this.isScaled) {
                    display.drawImageScaled(image, drawPos, imageSize);
                }
                else {
                    display.drawImage(image, drawPos);
                }
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
        GameFramework.VisualImageImmediate = VisualImageImmediate;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
