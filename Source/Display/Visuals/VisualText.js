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
            static fromTextBindingFontAndColor(textBinding, font, colorFill) {
                return new VisualText(textBinding, font, colorFill, null // colorBorder
                );
            }
            static fromTextImmediate(text) {
                return VisualText.fromTextImmediateAndColors(text, GameFramework.Color.Instances().White, GameFramework.Color.Instances().Black);
            }
            static fromTextImmediateAndColors(text, colorFill, colorBorder) {
                return VisualText.fromTextImmediateFontAndColorsFillAndBorder(text, GameFramework.FontNameAndHeight.default(), colorFill, colorBorder);
            }
            static fromTextBindingFontAndColorsFillAndBorder(textBinding, font, colorFill, colorBorder) {
                return new VisualText(textBinding, font, colorFill, colorBorder);
            }
            static fromTextImmediateFontAndColor(text, font, colorFill) {
                return new VisualText(GameFramework.DataBinding.fromContext(text), font, colorFill, null // colorBorder
                );
            }
            static fromTextImmediateFontAndColorsFillAndBorder(text, font, colorFill, colorBorder) {
                return new VisualText(GameFramework.DataBinding.fromContext(text), font, colorFill, colorBorder);
            }
            // Visual.
            initialize(uwpe) {
                // todo - Load the font?
            }
            initializeIsComplete(uwpe) {
                return true;
            }
            draw(uwpe, display) {
                var entity = uwpe.entity;
                var contextOld = this._text.context;
                if (contextOld == null
                    || contextOld.constructor.name == GameFramework.UniverseWorldPlaceEntities.name) {
                    this._text.contextSet(uwpe);
                }
                var text = this.text();
                display.drawText(text, this.fontNameAndHeight, GameFramework.Locatable.of(entity).loc.pos, this.colorFill, this.colorBorder, true, // isCenteredHorizontally
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
