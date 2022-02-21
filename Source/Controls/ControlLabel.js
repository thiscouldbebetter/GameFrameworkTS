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
            static fromPosAndTextString(pos, textAsString) {
                return new ControlLabel(null, //name
                pos, null, // size
                false, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                GameFramework.DataBinding.fromGet((c) => textAsString), GameFramework.FontNameAndHeight.default());
            }
            static fromPosHeightAndText(pos, fontNameAndHeight, text) {
                return new ControlLabel(null, //name
                pos, null, // size
                false, // isTextCenteredHorizontally
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
