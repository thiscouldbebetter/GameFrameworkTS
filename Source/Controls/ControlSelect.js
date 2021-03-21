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
                var valueSelected = this.valueSelected();
                var options = this.options();
                for (var i = 0; i < options.length; i++) {
                    var option = options[i];
                    var optionValue = this.bindingForOptionValues.contextSet(option).get();
                    if (optionValue == valueSelected) {
                        this.indexOfOptionSelected = i;
                        break;
                    }
                }
                // Helper variables.
                this._drawPos = GameFramework.Coords.blank();
                this._sizeHalf = GameFramework.Coords.blank();
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
                if (this._valueSelected != null && this._valueSelected.constructor.name == GameFramework.DataBinding.name) {
                    this._valueSelected.set(valueToSelect);
                }
                else {
                    this._valueSelected = valueToSelect;
                }
            }
            options() {
                return (this._options.get == null ? this._options : this._options.get());
            }
            scalePosAndSize(scaleFactor) {
                this.pos.multiply(scaleFactor);
                this.size.multiply(scaleFactor);
                this.fontHeightInPixels *= scaleFactor.y;
            }
            valueSelected() {
                var returnValue = (this._valueSelected == null
                    ? null
                    : (this._valueSelected.get == null ? this._valueSelected : this._valueSelected.get()));
                return returnValue;
            }
            // drawable
            draw(universe, display, drawLoc) {
                var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
                var style = this.style(universe);
                display.drawRectangle(drawPos, this.size, GameFramework.Color.systemColorGet(style.colorFill), GameFramework.Color.systemColorGet(style.colorBorder), this.isHighlighted // areColorsReversed
                );
                drawPos.add(this._sizeHalf.overwriteWith(this.size).half());
                var optionSelected = this.optionSelected();
                var text = (optionSelected == null
                    ? "-"
                    : this.bindingForOptionText.contextSet(optionSelected).get());
                display.drawText(text, this.fontHeightInPixels, drawPos, GameFramework.Color.systemColorGet(style.colorBorder), GameFramework.Color.systemColorGet(style.colorFill), this.isHighlighted, true, // isCentered
                this.size.x // widthMaxInPixels
                );
            }
        }
        GameFramework.ControlSelect = ControlSelect;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
