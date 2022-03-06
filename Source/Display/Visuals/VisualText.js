"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualText {
            constructor(text, fontNameAndHeight, colorFill, colorBorder) {
                this._text = text;
                this.fontNameAndHeight =
                    fontNameAndHeight || GameFramework.FontNameAndHeight.default();
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
                var contextOld = this._text.context;
                if (contextOld == null
                    || contextOld.constructor.name == GameFramework.UniverseWorldPlaceEntities.name) {
                    this._text.contextSet(uwpe);
                }
                var text = this.text();
                display.drawText(text, this.fontNameAndHeight, entity.locatable().loc.pos, this.colorFill, this.colorBorder, true, // isCenteredHorizontally
                true, // isCenteredVertically
                null // sizeMaxInPixels
                );
            }
            text() {
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
