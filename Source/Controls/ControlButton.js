"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlButton extends GameFramework.ControlBase {
            constructor(name, pos, size, text, fontHeightInPixels, hasBorder, isEnabled, click, canBeHeldDown) {
                super(name, pos, size, fontHeightInPixels);
                this.text = text;
                this.hasBorder = hasBorder;
                this._isEnabled = isEnabled;
                this.click = click;
                this.canBeHeldDown = (canBeHeldDown == null ? false : canBeHeldDown);
                // Helper variables.
                this._drawLoc = GameFramework.Disposition.create();
                this._sizeHalf = GameFramework.Coords.create();
            }
            static from8(name, pos, size, text, fontHeightInPixels, hasBorder, isEnabled, click) {
                return new ControlButton(name, pos, size, text, fontHeightInPixels, hasBorder, isEnabled, click, false // canBeHeldDown
                );
            }
            actionHandle(actionNameToHandle, universe) {
                if (actionNameToHandle == GameFramework.ControlActionNames.Instances().ControlConfirm) {
                    this.click();
                }
                return (this.canBeHeldDown == false); // wasActionHandled
            }
            isEnabled() {
                return this._isEnabled.get();
            }
            // events
            mouseClick(clickPos) {
                if (this.isEnabled()) {
                    this.click();
                }
                return (this.canBeHeldDown == false); // wasClickHandled
            }
            scalePosAndSize(scaleFactor) {
                this.pos.multiply(scaleFactor);
                this.size.multiply(scaleFactor);
                this.fontHeightInPixels *= scaleFactor.y;
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
                drawPos.add(this._sizeHalf.overwriteWith(this.size).half());
                var colorText = (isEnabled ? colorBorder : style.colorDisabled());
                display.drawText(this.text, this.fontHeightInPixels, drawPos, (isHighlighted ? colorFill : colorText), (isHighlighted ? colorText : colorFill), true, // isCentered
                this.size.x // widthMaxInPixels
                );
            }
        }
        GameFramework.ControlButton = ControlButton;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
