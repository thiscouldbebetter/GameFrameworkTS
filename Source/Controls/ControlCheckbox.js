"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlCheckbox extends GameFramework.ControlBase {
            constructor(name, pos, size, text, fontNameAndHeight, isEnabled, valueBinding) {
                super(name, pos, size, fontNameAndHeight);
                this._text = text;
                this._isEnabled = isEnabled;
                this.valueBinding = valueBinding;
                // Helper variables.
                this._drawLoc = GameFramework.Disposition.create();
                this._sizeHalf = GameFramework.Coords.create();
            }
            actionHandle(actionNameToHandle, universe) {
                if (actionNameToHandle == GameFramework.ControlActionNames.Instances().ControlConfirm) {
                    this.click();
                }
                return true; // wasHandled
            }
            click() {
                var value = this.value();
                var valueNext = (value == false);
                this.valueBinding.set(valueNext);
            }
            isEnabled() {
                return this._isEnabled.get();
            }
            text() {
                return this._text.get();
            }
            value() {
                return this.valueBinding.get();
            }
            // events
            mouseClick(clickPos) {
                if (this.isEnabled()) {
                    this.click();
                }
                return true; // wasClickHandled
            }
            // drawable
            draw(universe, display, drawLoc, style) {
                var drawPos = this._drawLoc.overwriteWith(drawLoc).pos;
                drawPos.add(this.pos);
                var isEnabled = this.isEnabled();
                var isHighlighted = this.isHighlighted && isEnabled;
                style = style || this.style(universe);
                var colorFill = style.colorFill();
                var colorBorder = style.colorBorder();
                style.drawBoxOfSizeAtPosWithColorsToDisplay(this.size, drawPos, colorFill, colorBorder, isHighlighted, display);
                var colorText = (isEnabled ? colorBorder : style.colorDisabled());
                var textAsString = this.text();
                var value = this.value();
                var valueAsText = (value ? "X" : " ");
                textAsString = "[" + valueAsText + "] " + textAsString;
                display.drawText(textAsString, this.fontNameAndHeight, drawPos, (isHighlighted ? colorFill : colorText), (isHighlighted ? colorText : colorFill), true, // isCenteredHorizontally
                true, // isCenteredVertically
                this.size // sizeMaxInPixels
                );
            }
        }
        GameFramework.ControlCheckbox = ControlCheckbox;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
