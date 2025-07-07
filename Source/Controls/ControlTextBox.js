"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlTextBox extends GameFramework.ControlBase {
            constructor(name, pos, size, text, fontNameAndHeight, numberOfCharsMax, isEnabled) {
                super(name, pos, size, fontNameAndHeight);
                this._text = text;
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
            text(value) {
                if (value != null) {
                    this._text.set(value);
                }
                return this._text.get();
            }
            // events
            actionHandle(actionNameToHandle, universe) {
                var text = this.text(null);
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                if (actionNameToHandle == controlActionNames.ControlCancel
                    || actionNameToHandle == GameFramework.Input.Instances().Backspace.name) {
                    this.text(text.substr(0, text.length - 1));
                    this.cursorPos = GameFramework.NumberHelper.wrapToRangeMinMax(this.cursorPos - 1, 0, text.length + 1);
                }
                else if (actionNameToHandle == controlActionNames.ControlConfirm) {
                    this.cursorPos = GameFramework.NumberHelper.wrapToRangeMinMax(this.cursorPos + 1, 0, text.length + 1);
                }
                else if (actionNameToHandle == controlActionNames.ControlIncrement
                    || actionNameToHandle == controlActionNames.ControlDecrement) {
                    // This is a bit counterintuitive.
                    var direction = (actionNameToHandle == controlActionNames.ControlIncrement
                        ? -1
                        : 1);
                    var charCodeAtCursor = (this.cursorPos < text.length
                        ? text.charCodeAt(this.cursorPos)
                        : "A".charCodeAt(0) - 1);
                    if (charCodeAtCursor == "Z".charCodeAt(0)
                        && direction == 1) {
                        charCodeAtCursor = "a".charCodeAt(0);
                    }
                    else if (charCodeAtCursor == "a".charCodeAt(0)
                        && direction == -1) {
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
                    this.text(textEdited);
                }
                else if (actionNameToHandle.length == 1) {
                    // Printable character.
                    if (this.numberOfCharsMax == null
                        || text.length < this.numberOfCharsMax) {
                        var textEdited = text.substr(0, this.cursorPos)
                            + actionNameToHandle
                            + text.substr(this.cursorPos);
                        text = this.text(textEdited);
                        this.cursorPos = GameFramework.NumberHelper.wrapToRangeMinMax(this.cursorPos + 1, 0, text.length + 1);
                    }
                }
                return true; // wasActionHandled
            }
            focusGain() {
                this.isHighlighted = true;
                this.cursorPos = this.text(null).length;
            }
            focusLose() {
                this.isHighlighted = false;
                this.cursorPos = null;
            }
            isEnabled() {
                return this._isEnabled.get();
            }
            mouseClick(mouseClickPos) {
                var parent = this.parent;
                var parentAsContainer = parent;
                parentAsContainer.indexOfChildWithFocus =
                    parentAsContainer.children.indexOf(this);
                this.isHighlighted = true;
                return true;
            }
            mouseEnter() { }
            mouseExit() { }
            scalePosAndSize(scaleFactor) {
                return super.scalePosAndSize(scaleFactor);
            }
            // drawable
            draw(universe, display, drawLoc) {
                var fontHeightInPixels = this.fontNameAndHeight.heightInPixels;
                var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
                var style = this.style(universe);
                var text = this.text(null);
                var textWidth = display.textWidthForFontHeight(text, fontHeightInPixels);
                var textSize = this._textSize.overwriteWithDimensions(textWidth, fontHeightInPixels, 0);
                var textMargin = this._textMargin.overwriteWith(this.size).subtract(textSize).half();
                var drawPosText = this._drawPosText.overwriteWith(drawPos).add(textMargin);
                style.drawBoxOfSizeAtPosWithColorsToDisplay(this.size, drawPos, style.colorFill(), style.colorBorder(), this.isHighlighted, display);
                if (this.isHighlighted == false) {
                    display.drawTextWithFontAtPosWithColorsFillAndOutline(text, this.fontNameAndHeight, drawPosText, style.colorBorder(), style.colorFill(), false, // isCenteredHorizontally
                    false, // isCenteredVertically
                    this.size);
                }
                else {
                    display.drawTextWithFontAtPosWithColorsFillAndOutline(text, this.fontNameAndHeight, drawPosText, style.colorFill(), style.colorBorder(), false, // isCenteredHorizontally
                    false, // isCenteredVertically
                    this.size);
                    var textBeforeCursor = text.substr(0, this.cursorPos);
                    var textAtCursor = text.substr(this.cursorPos, 1);
                    var cursorX = display.textWidthForFontHeight(textBeforeCursor, fontHeightInPixels);
                    var cursorWidth = display.textWidthForFontHeight(textAtCursor, fontHeightInPixels);
                    drawPosText.x += cursorX;
                    style.drawBoxOfSizeAtPosWithColorsToDisplay(GameFramework.Coords.fromXY(cursorWidth, fontHeightInPixels), // size
                    drawPosText, style.colorFill(), style.colorFill(), // ?
                    this.isHighlighted, display);
                    display.drawTextWithFontAtPosWithColorsFillAndOutline(textAtCursor, this.fontNameAndHeight, drawPosText, style.colorBorder(), null, // colorBack
                    false, // isCenteredHorizontally
                    false, // isCenteredVertically
                    this.size);
                }
            }
        }
        GameFramework.ControlTextBox = ControlTextBox;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
