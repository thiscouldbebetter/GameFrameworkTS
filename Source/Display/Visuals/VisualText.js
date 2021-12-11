"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualText {
            constructor(text, heightInPixels, colorFill, colorBorder) {
                this._text = text;
                this.heightInPixels = heightInPixels || 10;
                this.colorFill = colorFill;
                this.colorBorder = colorBorder;
                this._universeWorldPlaceEntities = GameFramework.UniverseWorldPlaceEntities.create();
            }
            static fromTextHeightAndColor(text, heightInPixels, colorFill) {
                return new VisualText(GameFramework.DataBinding.fromContext(text), null, // heightInPixels
                colorFill, null // colorBorder
                );
            }
            static fromTextHeightAndColors(text, heightInPixels, colorFill, colorBorder) {
                return new VisualText(GameFramework.DataBinding.fromContext(text), null, // heightInPixels
                colorFill, colorBorder);
            }
            draw(uwpe, display) {
                var entity = uwpe.entity;
                var text = this.text(uwpe, display);
                display.drawText(text, this.heightInPixels, entity.locatable().loc.pos, this.colorFill, this.colorBorder, true, // isCentered
                null // widthMaxInPixels
                );
            }
            text(uwpe, display) {
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
        GameFramework.VisualText = VisualText;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
