"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlLabel extends GameFramework.ControlBase {
            constructor(name, pos, size, isTextCentered, text, fontHeightInPixels) {
                super(name, pos, size, fontHeightInPixels);
                this.isTextCentered = isTextCentered;
                this._text = text;
                // Helper variables.
                this._drawPos = GameFramework.Coords.create();
            }
            static fromPosAndText(pos, text) {
                return new ControlLabel(null, //name
                pos, null, // size
                false, // isTextCentered
                text, 10 // fontHeightInPixels
                );
            }
            static from5(name, pos, size, isTextCentered, text) {
                return new ControlLabel(name, pos, size, isTextCentered, text, null // fontHeightInPixels
                );
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
                return (this._text.get == null ? this._text : this._text.get());
            }
            // drawable
            draw(universe, display, drawLoc, style) {
                var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
                var style = style || this.style(universe);
                var text = this.text();
                if (text != null) {
                    var textAsLines = ("" + text).split("\n");
                    var widthMaxInPixels = (this.size == null ? null : this.size.x);
                    for (var i = 0; i < textAsLines.length; i++) {
                        var textLine = textAsLines[i];
                        display.drawText(textLine, this.fontHeightInPixels, drawPos, GameFramework.Color.systemColorGet(style.colorBorder), GameFramework.Color.systemColorGet(style.colorFill), // colorOutline
                        null, // areColorsReversed
                        this.isTextCentered, widthMaxInPixels);
                        drawPos.y += this.fontHeightInPixels;
                    }
                }
            }
        }
        GameFramework.ControlLabel = ControlLabel;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
