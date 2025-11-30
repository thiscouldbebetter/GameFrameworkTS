"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlScrollbar extends GameFramework.ControlBase {
            constructor(pos, size, fontNameAndHeight, itemHeight, items, sliderPosInItems) {
                super(null, pos, size, fontNameAndHeight);
                this.itemHeight = itemHeight;
                this._items = items;
                this._sliderPosInItems = sliderPosInItems;
                this.windowSizeInItems = Math.floor(this.size.y / itemHeight);
                this.handleSize = Coords.fromXY(this.size.x, this.size.x);
                this.buttonScrollUp = GameFramework.ControlButton.fromPosSizeTextFontClick(Coords.create(), // pos
                this.handleSize.clone(), // size
                "-", // text
                this.fontNameAndHeight, this.scrollUp // click
                );
                this.buttonScrollDown = GameFramework.ControlButton.fromPosSizeTextFontClick(Coords.fromXY(0, this.size.y - this.handleSize.y), // pos
                this.handleSize.clone(), // size
                "+", // text
                this.fontNameAndHeight, this.scrollDown // click
                );
                // Helper variables.
                this._drawPos = Coords.create();
            }
            actionHandle(actionNameToHandle, universe) {
                return true;
            }
            isVisible() {
                return this.windowSizeInItems < this.items().length;
            }
            items() {
                return this._items.get();
            }
            mouseClick(pos) {
                return false;
            }
            scalePosAndSize(scaleFactor) {
                super.scalePosAndSize(scaleFactor);
                this.handleSize.multiply(scaleFactor);
                this.buttonScrollUp.scalePosAndSize(scaleFactor);
                this.buttonScrollDown.scalePosAndSize(scaleFactor);
                return this;
            }
            scrollDown() {
                var sliderPosInItems = GameFramework.NumberHelper.trimToRangeMinMax(this.sliderPosInItems() + 1, 0, this.sliderMaxInItems());
                this._sliderPosInItems = sliderPosInItems;
            }
            scrollUp() {
                var sliderPosInItems = GameFramework.NumberHelper.trimToRangeMinMax(this.sliderPosInItems() - 1, 0, this.sliderMaxInItems());
                this._sliderPosInItems = sliderPosInItems;
            }
            slideSizeInPixels() {
                var slideSizeInPixels = new Coords(this.handleSize.x, this.size.y - 2 * this.handleSize.y, 0);
                return slideSizeInPixels;
            }
            sliderPosInItems() {
                return this._sliderPosInItems;
            }
            sliderMaxInItems() {
                return this.items().length - Math.floor(this.windowSizeInItems);
            }
            sliderPosInPixels() {
                var sliderPosInPixels = new Coords(this.size.x - this.handleSize.x, this.handleSize.y
                    + this.sliderPosInItems()
                        * this.slideSizeInPixels().y
                        / this.items().length, 0);
                return sliderPosInPixels;
            }
            sliderSizeInPixels() {
                var sliderSizeInPixels = this.slideSizeInPixels().multiply(Coords.fromXY(1, this.windowSizeInItems / this.items().length));
                return sliderSizeInPixels;
            }
            // drawable
            draw(universe, display, drawLoc, style) {
                if (this.isVisible()) {
                    style = style || this.style(universe);
                    var colorFore = (this.isHighlighted ? style.colorFill() : style.colorBorder());
                    var colorBack = (this.isHighlighted ? style.colorBorder() : style.colorFill());
                    var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
                    display.drawRectangle(drawPos, this.size, colorFore, null);
                    drawLoc.pos.add(this.pos);
                    this.buttonScrollDown.draw(universe, display, drawLoc, style);
                    this.buttonScrollUp.draw(universe, display, drawLoc, style);
                    var sliderPosInPixels = this.sliderPosInPixels().add(drawPos);
                    var sliderSizeInPixels = this.sliderSizeInPixels();
                    display.drawRectangle(sliderPosInPixels, sliderSizeInPixels, colorBack, colorFore);
                }
            }
        }
        GameFramework.ControlScrollbar = ControlScrollbar;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
