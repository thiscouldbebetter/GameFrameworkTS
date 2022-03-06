"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlList extends GameFramework.ControlBase {
            constructor(name, pos, size, items, bindingForItemText, fontHeightInPixels, bindingForItemSelected, bindingForItemValue, bindingForIsEnabled, confirm, widthInItems) {
                super(name, pos, size, fontHeightInPixels);
                this._items = items;
                this.bindingForItemText = bindingForItemText;
                this.bindingForItemSelected = bindingForItemSelected;
                this.bindingForItemValue = bindingForItemValue;
                this.bindingForIsEnabled =
                    bindingForIsEnabled
                        || GameFramework.DataBinding.fromTrueWithContext(null);
                this._confirm = confirm;
                this.widthInItems = widthInItems || 1;
                var itemSizeY = 1.2 * this.fontHeightInPixels; // hack
                this._itemSize = GameFramework.Coords.fromXY(size.x, itemSizeY);
                var scrollbarWidth = itemSizeY;
                this.isHighlighted = false;
                this.scrollbar = new GameFramework.ControlScrollbar(GameFramework.Coords.fromXY(this.size.x - scrollbarWidth, 0), // pos
                GameFramework.Coords.fromXY(scrollbarWidth, this.size.y), // size
                this.fontHeightInPixels, itemSizeY, // itemHeight
                this._items, 0 // value
                );
                // Helper variables.
                this._drawPos = GameFramework.Coords.create();
                this._drawLoc = GameFramework.Disposition.fromPos(this._drawPos);
                this._mouseClickPos = GameFramework.Coords.create();
            }
            static fromPosSizeItemsAndBindingForItemText(pos, size, items, bindingForItemText) {
                var returnValue = new ControlList("", // name,
                pos, size, items, bindingForItemText, 10, // fontHeightInPixels,
                null, // bindingForItemSelected,
                null, // bindingForItemValue,
                GameFramework.DataBinding.fromTrue(), // isEnabled
                null, // confirm
                null // widthInItems
                );
                return returnValue;
            }
            static from6(name, pos, size, items, bindingForItemText, fontHeightInPixels) {
                return new ControlList(name, pos, size, items, bindingForItemText, fontHeightInPixels, null, null, null, null, null);
            }
            static from7(name, pos, size, items, bindingForItemText, fontHeightInPixels, bindingForItemSelected) {
                return new ControlList(name, pos, size, items, bindingForItemText, fontHeightInPixels, bindingForItemSelected, null, null, null, null);
            }
            static from8(name, pos, size, items, bindingForItemText, fontHeightInPixels, bindingForItemSelected, bindingForItemValue) {
                return new ControlList(name, pos, size, items, bindingForItemText, fontHeightInPixels, bindingForItemSelected, bindingForItemValue, null, null, null);
            }
            static from9(name, pos, size, items, bindingForItemText, fontHeightInPixels, bindingForItemSelected, bindingForItemValue, bindingForIsEnabled) {
                return new ControlList(name, pos, size, items, bindingForItemText, fontHeightInPixels, bindingForItemSelected, bindingForItemValue, bindingForIsEnabled, null, null);
            }
            static from10(name, pos, size, items, bindingForItemText, fontHeightInPixels, bindingForItemSelected, bindingForItemValue, bindingForIsEnabled, confirm) {
                return new ControlList(name, pos, size, items, bindingForItemText, fontHeightInPixels, bindingForItemSelected, bindingForItemValue, bindingForIsEnabled, confirm, null);
            }
            actionHandle(actionNameToHandle, universe) {
                var wasActionHandled = false;
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                if (this.isEnabled() == false) {
                    wasActionHandled = true; // ?
                }
                else if (actionNameToHandle == controlActionNames.ControlIncrement) {
                    this.itemSelectNextInDirection(1);
                    wasActionHandled = true;
                }
                else if (actionNameToHandle == controlActionNames.ControlDecrement) {
                    this.itemSelectNextInDirection(-1);
                    wasActionHandled = true;
                }
                else if (actionNameToHandle == controlActionNames.ControlConfirm) {
                    this.confirm(universe);
                    wasActionHandled = true;
                }
                return wasActionHandled;
            }
            confirm(universe) {
                if (this._confirm != null) {
                    this._confirm(universe);
                }
            }
            indexOfFirstItemVisible() {
                return this.indexOfFirstRowVisible() * this.widthInItems;
            }
            indexOfFirstRowVisible() {
                return this.scrollbar.sliderPosInItems();
            }
            indexOfItemSelected() {
                var items = this.items();
                var returnValue = items.indexOf(this.itemSelected());
                if (returnValue == -1) {
                    returnValue = null;
                }
                return returnValue;
            }
            indexOfLastItemVisible() {
                return this.indexOfLastRowVisible() * this.widthInItems;
            }
            indexOfLastRowVisible() {
                var rowCountVisible = Math.floor(this.scrollbar.windowSizeInItems) - 1;
                var returnValue = this.indexOfFirstRowVisible() + rowCountVisible;
                return returnValue;
            }
            isEnabled() {
                var returnValue = (this.bindingForIsEnabled == null
                    ? true
                    : this.bindingForIsEnabled.get());
                return returnValue;
            }
            itemSelect(itemToSet) {
                var returnValue = itemToSet;
                this._itemSelected = itemToSet;
                if (this.bindingForItemSelected != null) {
                    var valueToSet;
                    if (this.bindingForItemValue == null) {
                        valueToSet = this._itemSelected;
                    }
                    else {
                        valueToSet = this.bindingForItemValue.contextSet(this._itemSelected).get();
                        this.bindingForItemValue.set(valueToSet);
                    }
                    this.bindingForItemSelected.set(itemToSet);
                }
                return returnValue;
            }
            itemSelectByIndex(itemToSelectIndex) {
                var items = this.items();
                var itemToSelect = items[itemToSelectIndex];
                var returnValue = this.itemSelect(itemToSelect);
                return returnValue;
            }
            itemSelected() {
                var returnValue;
                if (this.bindingForItemSelected == null) {
                    returnValue = this._itemSelected;
                }
                else {
                    returnValue =
                        (this.bindingForItemSelected.get == null
                            ? this._itemSelected
                            : this.bindingForItemSelected.get());
                }
                return returnValue;
            }
            itemSelectNextInDirection(direction) {
                var items = this.items();
                var numberOfItems = items.length;
                var indexOfItemSelected = this.indexOfItemSelected();
                if (indexOfItemSelected == null) {
                    if (numberOfItems > 0) {
                        if (direction == 1) {
                            indexOfItemSelected = 0;
                        }
                        else // if (direction == -1)
                         {
                            indexOfItemSelected = numberOfItems - 1;
                        }
                    }
                }
                else {
                    indexOfItemSelected = GameFramework.NumberHelper.trimToRangeMinMax(indexOfItemSelected + direction, 0, numberOfItems - 1);
                }
                var itemToSelect = (indexOfItemSelected == null ? null : items[indexOfItemSelected]);
                this.itemSelect(itemToSelect);
                var indexOfFirstItemVisible = this.indexOfFirstItemVisible();
                var indexOfLastItemVisible = this.indexOfLastItemVisible();
                var indexOfItemSelected = this.indexOfItemSelected();
                if (indexOfItemSelected < indexOfFirstItemVisible) {
                    this.scrollbar.scrollUp();
                }
                else if (indexOfItemSelected > indexOfLastItemVisible) {
                    this.scrollbar.scrollDown();
                }
                var returnValue = this.itemSelected();
                return returnValue;
            }
            itemSize() {
                var scrollbarWidthVisible = (this.scrollbar.isVisible() ? this.scrollbar.size.x : 0);
                return this._itemSize.overwriteWithDimensions((this.size.x - scrollbarWidthVisible) / this.widthInItems, this._itemSize.y, 0);
            }
            items() {
                return this._items.get();
            }
            mouseClick(clickPos) {
                if (this.isEnabled() == false) {
                    return true; // wasActionHandled
                }
                clickPos = this._mouseClickPos.overwriteWith(clickPos);
                var isClickPosInScrollbar = (clickPos.x - this.pos.x > this.size.x - this.scrollbar.handleSize.x);
                if (isClickPosInScrollbar) {
                    if (clickPos.y - this.pos.y <= this.scrollbar.handleSize.y) {
                        this.scrollbar.scrollUp();
                    }
                    else if (clickPos.y - this.pos.y
                        >= this.scrollbar.size.y - this.scrollbar.handleSize.y) {
                        this.scrollbar.scrollDown();
                    }
                }
                else {
                    var clickOffsetInPixels = clickPos.clone().subtract(this.pos);
                    var clickOffsetInItems = clickOffsetInPixels.clone().divide(this.itemSize()).floor();
                    var rowOfItemClicked = this.indexOfFirstRowVisible() + clickOffsetInItems.y;
                    var indexOfItemClicked = rowOfItemClicked * this.widthInItems + clickOffsetInItems.x;
                    var items = this.items();
                    if (indexOfItemClicked < items.length) {
                        var indexOfItemSelectedOld = this.indexOfItemSelected();
                        if (indexOfItemClicked == indexOfItemSelectedOld) {
                            if (this.confirm != null) {
                                this.confirm(null); // todo
                            }
                        }
                        else {
                            this.itemSelectByIndex(indexOfItemClicked);
                        }
                    }
                }
                return true; // wasActionHandled
            }
            mouseEnter() { }
            mouseExit() { }
            mouseMove(movePos) { return false; }
            scalePosAndSize(scaleFactor) {
                this.pos.multiply(scaleFactor);
                this.size.multiply(scaleFactor);
                this.fontHeightInPixels *= scaleFactor.y;
                this._itemSize.multiply(scaleFactor);
                this.scrollbar.scalePosAndSize(scaleFactor);
                return this;
            }
            // drawable
            draw(universe, display, drawLoc, style) {
                drawLoc = this._drawLoc.overwriteWith(drawLoc);
                var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
                var style = style || this.style(universe);
                var colorFore = style.colorBorder();
                var colorBack = style.colorFill();
                style.drawBoxOfSizeAtPosWithColorsToDisplay(this.size, drawPos, colorBack, colorFore, this.isHighlighted, display);
                var textMarginLeft = 2;
                var items = this.items();
                if (items == null) {
                    return;
                }
                var indexStart = this.indexOfFirstItemVisible();
                var indexEnd = this.indexOfLastItemVisible();
                if (indexEnd >= items.length) {
                    indexEnd = items.length - 1;
                }
                var itemSelected = this.itemSelected();
                var drawPos2 = GameFramework.Coords.create();
                for (var i = indexStart; i <= indexEnd; i++) {
                    var item = items[i];
                    var iOffset = i - indexStart;
                    var offsetInItems = new GameFramework.Coords(iOffset % this.widthInItems, Math.floor(iOffset / this.widthInItems), 0);
                    drawPos2.overwriteWith(this.itemSize()).multiply(offsetInItems).add(drawPos);
                    if (item == itemSelected) {
                        style.drawBoxOfSizeAtPosWithColorsToDisplay(this.itemSize(), drawPos2, colorFore, colorBack, this.isHighlighted, display);
                    }
                    var text = this.bindingForItemText.contextSet(item).get();
                    drawPos2.addDimensions(textMarginLeft, 0, 0);
                    var isItemSelected = (i == this.indexOfItemSelected());
                    ;
                    var areColorsReversed = ((this.isHighlighted && !isItemSelected)
                        ||
                            (isItemSelected && !this.isHighlighted));
                    var textSizeMax = GameFramework.Coords.fromXY(this.itemSize().x, this.fontHeightInPixels);
                    display.drawText(text, this.fontHeightInPixels, drawPos2, (areColorsReversed ? colorBack : colorFore), (areColorsReversed ? colorFore : colorBack), false, // isCenteredHorizontally
                    false, // isTextCenteredVertically
                    textSizeMax);
                }
                this.scrollbar.draw(universe, display, drawLoc, style);
            }
        }
        GameFramework.ControlList = ControlList;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
