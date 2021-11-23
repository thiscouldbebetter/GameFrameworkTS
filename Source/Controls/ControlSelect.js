"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlSelect extends GameFramework.ControlBase {
            constructor(name, pos, size, valueSelected, options, bindingForOptionValues, bindingForOptionText, fontHeightInPixels) {
                super(name, pos, size, fontHeightInPixels);
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
                this._drawPos = GameFramework.Coords.create();
                this._sizeHalf = GameFramework.Coords.create();
            }
            actionHandle(actionNameToHandle, universe) {
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                if (actionNameToHandle == controlActionNames.ControlDecrement) {
                    this.optionSelectedNextInDirection(-1);
                }
                else if (actionNameToHandle == controlActionNames.ControlIncrement
                    || actionNameToHandle == controlActionNames.ControlConfirm) {
                    this.optionSelectedNextInDirection(1);
                }
                return true; // wasActionHandled
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
                this.indexOfOptionSelected = GameFramework.NumberHelper.wrapToRangeMinMax(this.indexOfOptionSelected + direction, 0, options.length);
                var optionSelected = this.optionSelected();
                var valueToSelect = (optionSelected == null
                    ? null
                    : this.bindingForOptionValues.contextSet(optionSelected).get());
                this._valueSelected.set(valueToSelect);
            }
            options() {
                return this._options.get();
            }
            scalePosAndSize(scaleFactor) {
                this.pos.multiply(scaleFactor);
                this.size.multiply(scaleFactor);
                this.fontHeightInPixels *= scaleFactor.y;
            }
            valueSelected() {
                var returnValue = this._valueSelected.get();
                return returnValue;
            }
            // drawable
            draw(universe, display, drawLoc) {
                var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
                var style = this.style(universe);
                display.drawRectangle(drawPos, this.size, (this.isHighlighted ? style.colorBorder() : style.colorFill()), (this.isHighlighted ? style.colorFill() : style.colorBorder()));
                drawPos.add(this._sizeHalf.overwriteWith(this.size).half());
                var optionSelected = this.optionSelected();
                var text = (optionSelected == null
                    ? "-"
                    : this.bindingForOptionText.contextSet(optionSelected).get());
                display.drawText(text, this.fontHeightInPixels, drawPos, (this.isHighlighted ? style.colorFill() : style.colorBorder()), (this.isHighlighted ? style.colorBorder() : style.colorFill()), true, // isCentered
                this.size.x // widthMaxInPixels
                );
            }
        }
        GameFramework.ControlSelect = ControlSelect;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
