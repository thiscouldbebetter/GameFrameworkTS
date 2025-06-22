"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlNumber extends GameFramework.ControlBase {
            constructor(name, pos, size, value, valueMin, valueMax, fontNameAndHeight, isEnabled) {
                super(name, pos, size, fontNameAndHeight);
                this._value = value;
                this._valueMin = valueMin;
                this._valueMax = valueMax;
                this._isEnabled = isEnabled;
                this.cursorPos = null;
                // Helper variables.
                this._drawPos = GameFramework.Coords.create();
                this._drawPosText = GameFramework.Coords.create();
                this._drawLoc = GameFramework.Disposition.fromPos(this._drawPos);
                this._textMargin = GameFramework.Coords.create();
                this._textSize = GameFramework.Coords.create();
            }
            numberOfDigitsMax() {
                return Math.ceil(Math.log(this.valueMax()) / Math.log(10));
            }
            value() {
                return this._value.get();
            }
            valueMin() {
                return this._valueMin.get();
            }
            valueMax() {
                return this._valueMax.get();
            }
            valueSet(valueToSet) {
                this._value.set(valueToSet);
            }
            // events
            actionHandle(actionNameToHandle, universe) {
                var value = this.value();
                var valueAsString = value.toString();
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                if (actionNameToHandle == controlActionNames.ControlCancel
                    || actionNameToHandle == GameFramework.Input.Names().Backspace) {
                    valueAsString = valueAsString.substr(0, valueAsString.length - 1);
                    value = parseFloat(valueAsString);
                    this.valueSet(value);
                    this.cursorPos = GameFramework.NumberHelper.wrapToRangeMinMax(this.cursorPos - 1, 0, valueAsString.length + 1);
                }
                else if (actionNameToHandle == controlActionNames.ControlConfirm) {
                    this.cursorPos = GameFramework.NumberHelper.wrapToRangeMinMax(this.cursorPos + 1, 0, valueAsString.length + 1);
                }
                else if (actionNameToHandle == controlActionNames.ControlIncrement
                    || actionNameToHandle == controlActionNames.ControlDecrement) {
                    // This is a bit counterintuitive.
                    var direction = (actionNameToHandle == controlActionNames.ControlIncrement
                        ? -1
                        : 1);
                    var valueOld = this.value();
                    var valueNew = valueOld + direction;
                    if (valueNew < this.valueMin()) {
                        valueNew = this.valueMin();
                    }
                    else if (valueNew > this.valueMax()) {
                        valueNew = this.valueMax();
                    }
                    this.valueSet(valueNew);
                }
                else if (actionNameToHandle.length == 1) {
                    // Printable character.
                    if (this.numberOfDigitsMax() == null
                        || this.value.toString().length < this.numberOfDigitsMax()) {
                        var valueAsStringEdited = valueAsString.substr(0, this.cursorPos)
                            + actionNameToHandle
                            + valueAsString.substr(this.cursorPos);
                        value = parseFloat(valueAsStringEdited);
                        this.valueSet(value);
                        this.cursorPos = GameFramework.NumberHelper.wrapToRangeMinMax(this.cursorPos + 1, 0, valueAsStringEdited.length + 1);
                    }
                }
                return true; // wasActionHandled
            }
            focusGain() {
                this.isHighlighted = true;
                this.cursorPos = this.value.toString().length;
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
            // drawable
            draw(universe, display, drawLoc) {
                var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
                var style = this.style(universe);
                var text = this.value().toString();
                var textWidth = display.textWidthForFontHeight(text, this.fontNameAndHeight.heightInPixels);
                var textSize = this._textSize.overwriteWithDimensions(textWidth, this.fontNameAndHeight.heightInPixels, 0);
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
                    var cursorX = display.textWidthForFontHeight(textBeforeCursor, this.fontNameAndHeight.heightInPixels);
                    var cursorWidth = display.textWidthForFontHeight(textAtCursor, this.fontNameAndHeight.heightInPixels);
                    drawPosText.x += cursorX;
                    style.drawBoxOfSizeAtPosWithColorsToDisplay(GameFramework.Coords.fromXY(cursorWidth, this.fontNameAndHeight.heightInPixels), // size
                    drawPosText, style.colorFill(), style.colorFill(), // ?
                    this.isHighlighted, display);
                    display.drawTextWithFontAtPosWithColorsFillAndOutline(textAtCursor, this.fontNameAndHeight, drawPosText, style.colorBorder(), null, // colorBack
                    false, // isCenteredHorizontally
                    false, // isCenteredVertically
                    this.size);
                }
            }
        }
        GameFramework.ControlNumber = ControlNumber;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
