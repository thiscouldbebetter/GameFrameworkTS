"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlLabel extends GameFramework.ControlBase {
            constructor(name, pos, size, isTextCenteredHorizontally, isTextCenteredVertically, text, fontNameAndHeight) {
                super(name, pos, size, fontNameAndHeight);
                this.isTextCenteredHorizontally = isTextCenteredHorizontally;
                this.isTextCenteredVertically = isTextCenteredVertically;
                this._text = text;
                // Helper variables.
                this._drawPos = GameFramework.Coords.create();
            }
            static from4Centered(pos, size, text, fontNameAndHeight) {
                return ControlLabel.fromPosSizeTextFontCentered(pos, size, text, fontNameAndHeight);
            }
            static from4CenteredHorizontally(pos, size, text, fontNameAndHeight) {
                return ControlLabel.fromPosSizeTextFontCenteredHorizontally(pos, size, text, fontNameAndHeight);
            }
            static from4Uncentered(pos, size, text, fontNameAndHeight) {
                return ControlLabel.fromPosSizeTextFontUncentered(pos, size, text, fontNameAndHeight);
            }
            static fromPosAndText(pos, text) {
                var fontNameAndHeight = GameFramework.FontNameAndHeight.default();
                var fontHeightInPixels = fontNameAndHeight.heightInPixels;
                var size = GameFramework.Coords.fromXY(100, 1).multiplyScalar(fontHeightInPixels);
                return new ControlLabel(ControlLabel.name + "_" + text.get(), //name
                pos, size, false, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                text, fontNameAndHeight);
            }
            static fromPosAndTextString(pos, textAsString) {
                var fontNameAndHeight = GameFramework.FontNameAndHeight.default();
                var fontHeightInPixels = fontNameAndHeight.heightInPixels;
                var size = GameFramework.Coords.fromXY(100, 1).multiplyScalar(fontHeightInPixels);
                var text = GameFramework.DataBinding.fromGet((c) => textAsString);
                return new ControlLabel(ControlLabel.name + "_" + textAsString, //name
                pos, size, false, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                text, fontNameAndHeight);
            }
            static fromPosHeightAndText(pos, fontNameAndHeight, text) {
                return new ControlLabel(null, //name
                pos, null, // size
                false, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                text, fontNameAndHeight);
            }
            static fromPosSizeTextFontCentered(pos, size, text, fontNameAndHeight) {
                var textFromBindingInitial = text.get();
                return new ControlLabel("label" + textFromBindingInitial.split(" ").join(""), pos, size, true, // isTextCenteredHorizontally
                true, // isTextCenteredVertically
                text, fontNameAndHeight);
            }
            static fromPosSizeTextFontCenteredHorizontally(pos, size, text, fontNameAndHeight) {
                var textFromBindingInitial = text.get();
                return new ControlLabel("label" + textFromBindingInitial.split(" ").join(""), pos, size, true, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                text, fontNameAndHeight);
            }
            static fromPosSizeTextFontUncentered(pos, size, text, fontNameAndHeight) {
                var textFromBindingInitial = text.get();
                return new ControlLabel("label" + textFromBindingInitial.split(" ").join(""), pos, size, false, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                text, fontNameAndHeight);
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
            text() {
                return this._text.get();
            }
            // drawable
            draw(universe, display, drawLoc, style) {
                var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
                var style = style || this.style(universe);
                var text = this.text();
                if (text != null) {
                    display.drawText(text, this.fontNameAndHeight, drawPos, style.colorBorder(), style.colorFill(), // colorOutline
                    this.isTextCenteredHorizontally, this.isTextCenteredVertically, this.size);
                }
            }
        }
        GameFramework.ControlLabel = ControlLabel;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
