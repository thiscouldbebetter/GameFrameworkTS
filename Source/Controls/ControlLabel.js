"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlLabel extends GameFramework.ControlBase {
            constructor(name, pos, size, isTextCenteredHorizontally, isTextCenteredVertically, text, fontHeightInPixels) {
                super(name, pos, size, fontHeightInPixels);
                this.isTextCenteredHorizontally = isTextCenteredHorizontally;
                this.isTextCenteredVertically = isTextCenteredVertically;
                this._text = text;
                // Helper variables.
                this._drawPos = GameFramework.Coords.create();
            }
            static fromPosAndTextString(pos, textAsString) {
                return new ControlLabel(null, //name
                pos, null, // size
                false, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                GameFramework.DataBinding.fromGet((c) => textAsString), 10 // fontHeightInPixels
                );
            }
            static fromPosHeightAndText(pos, fontHeightInPixels, text) {
                return new ControlLabel(null, //name
                pos, null, // size
                false, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                text, fontHeightInPixels);
            }
            actionHandle(actionName) {
                return false; // wasActionHandled
            }
            isEnabled() {
                return false;
            }
            mouseClick(pos) {
                return false;
            }
            scalePosAndSize(scaleFactor) {
                this.pos.multiply(scaleFactor);
                this.size.multiply(scaleFactor);
                this.fontHeightInPixels *= scaleFactor.y;
            }
            text() {
                return this._text.get();
            }
            // drawable
            draw(universe, display, drawLoc, style) {
                var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
                var style = style || this.style(universe);
                var text = this.text();
                if (text != null) {
                    display.drawText(text, this.fontHeightInPixels, drawPos, style.colorBorder(), style.colorFill(), // colorOutline
                    this.isTextCenteredHorizontally, this.isTextCenteredVertically, this.size);
                }
            }
        }
        GameFramework.ControlLabel = ControlLabel;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
