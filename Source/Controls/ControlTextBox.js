"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlTextBox extends GameFramework.ControlBase {
            constructor(name, pos, size, text, fontHeightInPixels, numberOfCharsMax, isEnabled) {
                super(name, pos, size, fontHeightInPixels);
                this._text = text;
                this.fontHeightInPixels = fontHeightInPixels;
                this.numberOfCharsMax = numberOfCharsMax;
                this._isEnabled = isEnabled;
                this.cursorPos = null;
                // Helper variables.
                this._drawPos = GameFramework.Coords.create();
                this._drawPosText = GameFramework.Coords.create();
                this._drawLoc = GameFramework.Disposition.fromPos(this._drawPos);
                this._textMargin = GameFramework.Coords.create();
                this._textSize = GameFramework.Coords.create();
            }
            text(value, universe) {
                if (value != null) {
                    if (this._text.set == null) {
                        this._text = value;
                    }
                    else {
                        this._text.set(value);
                    }
                }
                return (this._text.get == null ? this._text : this._text.get(universe));
            }
            // events
            actionHandle(actionNameToHandle, universe) {
                var text = this.text(null, null);
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                if (actionNameToHandle == controlActionNames.ControlCancel
                    || actionNameToHandle == GameFramework.Input.Names().Backspace) {
                    this.text(text.substr(0, text.length - 1), null);
                    this.cursorPos = GameFramework.NumberHelper.wrapToRangeMinMax(this.cursorPos - 1, 0, text.length + 1);
                }
                else if (actionNameToHandle == controlActionNames.ControlConfirm) {
                    this.cursorPos = GameFramework.NumberHelper.wrapToRangeMinMax(this.cursorPos + 1, 0, text.length + 1);
                }
                else if (actionNameToHandle == controlActionNames.ControlIncrement
                    || actionNameToHandle == controlActionNames.ControlDecrement) {
                    // This is a bit counterintuitive.
                    var direction = (actionNameToHandle == controlActionNames.ControlIncrement ? -1 : 1);
                    var charCodeAtCursor = (this.cursorPos < text.length ? text.charCodeAt(this.cursorPos) : "A".charCodeAt(0) - 1);
                    if (charCodeAtCursor == "Z".charCodeAt(0) && direction == 1) {
                        charCodeAtCursor = "a".charCodeAt(0);
                    }
                    else if (charCodeAtCursor == "a".charCodeAt(0) && direction == -1) {
                        charCodeAtCursor = "Z".charCodeAt(0);
                    }
                    else {
                        charCodeAtCursor = charCodeAtCursor + direction;
                    }
                    charCodeAtCursor = GameFramework.NumberHelper.wrapToRangeMinMax(charCodeAtCursor, "A".charCodeAt(0), "z".charCodeAt(0) + 1);
                    var charAtCursor = String.fromCharCode(charCodeAtCursor);
                    var textEdited = text.substr(0, this.cursorPos)
                        + charAtCursor
                        + text.substr(this.cursorPos + 1);
                    this.text(textEdited, null);
                }
                else if (actionNameToHandle.length == 1 || actionNameToHandle.startsWith("_")) // printable character
                 {
                    if (actionNameToHandle.startsWith("_")) {
                        if (actionNameToHandle == "_") {
                            actionNameToHandle = " ";
                        }
                        else {
                            actionNameToHandle = actionNameToHandle.substr(1);
                        }
                    }
                    if (this.numberOfCharsMax == null || text.length < this.numberOfCharsMax) {
                        var textEdited = text.substr(0, this.cursorPos)
                            + actionNameToHandle
                            + text.substr(this.cursorPos);
                        text = this.text(textEdited, null);
                        this.cursorPos = GameFramework.NumberHelper.wrapToRangeMinMax(this.cursorPos + 1, 0, text.length + 1);
                    }
                }
                return true; // wasActionHandled
            }
            focusGain() {
                this.isHighlighted = true;
                this.cursorPos = this.text(null, null).length;
            }
            focusLose() {
                this.isHighlighted = false;
                this.cursorPos = null;
            }
            isEnabled() {
                return (this._isEnabled.get());
            }
            mouseClick(mouseClickPos) {
                var parent = this.parent;
                var parentAsContainer = parent;
                parentAsContainer.indexOfChildWithFocus =
                    parentAsContainer.children.indexOf(this);
                this.isHighlighted = true;
                return true;
            }
            scalePosAndSize(scaleFactor) {
                this.pos.multiply(scaleFactor);
                this.size.multiply(scaleFactor);
                this.fontHeightInPixels *= scaleFactor.y;
                return this;
            }
            // drawable
            draw(universe, display, drawLoc) {
                var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
                var style = this.style(universe);
                var text = this.text(null, null);
                display.drawRectangle(drawPos, this.size, style.colorFill, style.colorBorder, this.isHighlighted // areColorsReversed
                );
                var textWidth = display.textWidthForFontHeight(text, this.fontHeightInPixels);
                var textSize = this._textSize.overwriteWithDimensions(textWidth, this.fontHeightInPixels, 0);
                var textMargin = this._textMargin.overwriteWith(this.size).subtract(textSize).half();
                var drawPosText = this._drawPosText.overwriteWith(drawPos).add(textMargin);
                display.drawText(text, this.fontHeightInPixels, drawPosText, style.colorBorder, style.colorFill, this.isHighlighted, false, // isCentered
                this.size.x // widthMaxInPixels
                );
                if (this.isHighlighted) {
                    var textBeforeCursor = text.substr(0, this.cursorPos);
                    var textAtCursor = text.substr(this.cursorPos, 1);
                    var cursorX = display.textWidthForFontHeight(textBeforeCursor, this.fontHeightInPixels);
                    var cursorWidth = display.textWidthForFontHeight(textAtCursor, this.fontHeightInPixels);
                    drawPosText.x += cursorX;
                    display.drawRectangle(drawPosText, new GameFramework.Coords(cursorWidth, this.fontHeightInPixels, 0), // size
                    style.colorFill, style.colorFill, // ?
                    null);
                    display.drawText(textAtCursor, this.fontHeightInPixels, drawPosText, style.colorBorder, null, // colorBack
                    false, // isHighlighted
                    false, // isCentered
                    this.size.x // widthMaxInPixels
                    );
                }
            }
        }
        GameFramework.ControlTextBox = ControlTextBox;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
