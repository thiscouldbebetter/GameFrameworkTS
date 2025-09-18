"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlSelect extends GameFramework.ControlBase {
            constructor(name, pos, size, valueSelected, options, bindingForOptionValues, bindingForOptionText, fontNameAndHeight) {
                super(name, pos, size, fontNameAndHeight);
                this._valueSelected = valueSelected;
                this._options = options;
                this.bindingForOptionValues = bindingForOptionValues;
                this.bindingForOptionText = bindingForOptionText;
                this.indexOfOptionSelected = null;
                var valueSelectedActualized = this.valueSelected();
                var optionsActualized = this.options();
                for (var i = 0; i < optionsActualized.length; i++) {
                    var option = optionsActualized[i];
                    var optionValue = this.bindingForOptionValues.contextSet(option).get();
                    if (optionValue == valueSelectedActualized) {
                        this.indexOfOptionSelected = i;
                        break;
                    }
                }
                // Helper variables.
                this._drawLoc = GameFramework.Disposition.create();
                this._sizeHalf = GameFramework.Coords.create();
            }
            actionHandle(actionNameToHandle, universe) {
                var actionWasHandled = false;
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                if (actionNameToHandle == controlActionNames.ControlDecrement) {
                    this.optionSelectedNextInDirection(-1);
                    actionWasHandled = true;
                }
                else if (actionNameToHandle == controlActionNames.ControlIncrement
                    || actionNameToHandle == controlActionNames.ControlConfirm) {
                    this.optionSelectedNextInDirection(1);
                    actionWasHandled = true;
                }
                return actionWasHandled;
            }
            mouseClick(clickPos) {
                this.optionSelectedNextInDirection(1);
                return true; // wasClickHandled
            }
            optionSelected() {
                var optionSelected = (this.indexOfOptionSelected == null
                    ? null
                    : this.options()[this.indexOfOptionSelected]);
                return optionSelected;
            }
            optionSelectedNextInDirection(direction) {
                var options = this.options();
                if (this.indexOfOptionSelected == null) {
                    if (direction == 1) {
                        this.indexOfOptionSelected = 0;
                    }
                    else {
                        this.indexOfOptionSelected = options.length - 1;
                    }
                }
                else {
                    this.indexOfOptionSelected = GameFramework.NumberHelper.wrapToRangeMinMax(this.indexOfOptionSelected + direction, 0, options.length);
                }
                var optionSelected = this.optionSelected();
                var valueToSelect = (optionSelected == null
                    ? null
                    : this.bindingForOptionValues.contextSet(optionSelected).get());
                this._valueSelected.set(valueToSelect);
            }
            options() {
                return this._options.get();
            }
            valueSelected() {
                var returnValue = this._valueSelected.get();
                return returnValue;
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
                var optionSelected = this.optionSelected();
                var text = (optionSelected == null
                    ? "-"
                    : this.bindingForOptionText.contextSet(optionSelected).get());
                display.drawTextWithFontAtPosWithColorsFillAndOutline(text, this.fontNameAndHeight, drawPos, (isHighlighted ? colorFill : colorText), (isHighlighted ? colorText : colorFill), true, // isCenteredHorizontally
                true, // isCenteredVertically
                this.size // sizeMaxInPixels
                );
            }
        }
        GameFramework.ControlSelect = ControlSelect;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
