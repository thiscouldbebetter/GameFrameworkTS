"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlButton extends GameFramework.ControlBase {
            constructor(name, pos, size, text, fontNameAndHeight, hasBorder, isEnabled, click, canBeHeldDown) {
                super(name, pos, size, fontNameAndHeight);
                this._text = text;
                this.hasBorder = hasBorder;
                this._isEnabled = isEnabled;
                this._click = click;
                this.canBeHeldDown = canBeHeldDown || false;
                // Helper variables.
                this._drawLoc = GameFramework.Disposition.create();
                this._sizeHalf = GameFramework.Coords.create();
            }
            static from5(pos, size, text, fontNameAndHeight, click) {
                return ControlButton.fromPosSizeTextFontClick(pos, size, text, fontNameAndHeight, click);
            }
            static fromPosSizeTextFontClick(pos, size, textAsString, fontNameAndHeight, click) {
                return ControlButton.from8("button" + textAsString.split(" ").join(""), pos, size, textAsString, fontNameAndHeight, true, // hasBorder
                GameFramework.DataBinding.fromTrue(), // isEnabled,
                click);
            }
            static from8(name, pos, size, textAsString, fontNameAndHeight, hasBorder, isEnabled, click) {
                var textAsBinding = GameFramework.DataBinding.fromGet((c) => textAsString);
                return new ControlButton(name, pos, size, textAsBinding, fontNameAndHeight, hasBorder, isEnabled, click, false // canBeHeldDown
                );
            }
            static from8WithTextAsBinding(name, pos, size, textAsBinding, fontNameAndHeight, hasBorder, isEnabled, click) {
                return new ControlButton(name, pos, size, textAsBinding, fontNameAndHeight, hasBorder, isEnabled, click, false // canBeHeldDown
                );
            }
            static from11(name, pos, size, textAsString, fontNameAndHeight, hasBorder, isEnabled, click, canBeHeldDown) {
                return new ControlButton(name, pos, size, GameFramework.DataBinding.fromGet((c) => textAsString), fontNameAndHeight, hasBorder, isEnabled, click, canBeHeldDown);
            }
            actionHandle(actionNameToHandle, universe) {
                if (actionNameToHandle == GameFramework.ControlActionNames.Instances().ControlConfirm) {
                    this.click();
                }
                return (this.canBeHeldDown == false); // wasActionHandled
            }
            click() {
                this._click();
            }
            isEnabled() {
                return this._isEnabled.get();
            }
            text() {
                return this._text.get();
            }
            // events
            mouseClick(clickPos) {
                if (this.isEnabled()) {
                    this.click();
                }
                return (this.canBeHeldDown == false); // wasClickHandled
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
                if (this.hasBorder) {
                    style.drawBoxOfSizeAtPosWithColorsToDisplay(this.size, drawPos, colorFill, colorBorder, isHighlighted, display);
                }
                var colorText = (isEnabled ? colorBorder : style.colorDisabled());
                var textAsString = this.text();
                display.drawText(textAsString, this.fontNameAndHeight, drawPos, (isHighlighted ? colorFill : colorText), (isHighlighted ? colorText : colorFill), true, // isCenteredHorizontally
                true, // isCenteredVertically
                this.size // sizeMaxInPixels
                );
            }
        }
        GameFramework.ControlButton = ControlButton;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
