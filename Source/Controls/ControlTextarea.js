"use strict";
class ControlTextarea extends ControlBase {
    constructor(name, pos, size, text, fontHeightInPixels, isEnabled) {
        super(name, pos, size, fontHeightInPixels);
        this._text = text;
        this._isEnabled = isEnabled;
        this.charCountMax = null; // todo
        this.cursorPos = null;
        this.lineSpacing = 1.2 * this.fontHeightInPixels; // hack
        var scrollbarWidth = this.lineSpacing;
        this.scrollbar = new ControlScrollbar(new Coords(this.size.x - scrollbarWidth, 0, 0), // pos
        new Coords(scrollbarWidth, this.size.y, 0), // size
        this.fontHeightInPixels, this.lineSpacing, // itemHeight
        new DataBinding(this, (c) => c.textAsLines(), null), 0 // sliderPosInItems
        );
        // Helper variables.
        this._drawPos = new Coords(0, 0, 0);
        this._drawLoc = new Disposition(this._drawPos, null, null);
        this._mouseClickPos = new Coords(0, 0, 0);
    }
    actionHandle(actionNameToHandle, universe) {
        var text = this.text(null);
        var controlActionNames = ControlActionNames.Instances();
        if (actionNameToHandle == controlActionNames.ControlCancel
            || actionNameToHandle == Input.Names().Backspace) {
            this.text(text.substr(0, text.length - 1));
            this.cursorPos = NumberHelper.wrapToRangeMinMax(this.cursorPos - 1, 0, text.length + 1);
        }
        else if (actionNameToHandle == controlActionNames.ControlConfirm) {
            this.cursorPos = NumberHelper.wrapToRangeMinMax(this.cursorPos + 1, 0, text.length + 1);
        }
        else if (actionNameToHandle.length == 1 || actionNameToHandle.startsWith("_")) {
            if (actionNameToHandle.startsWith("_")) {
                if (actionNameToHandle == "_") {
                    actionNameToHandle = " ";
                }
                else {
                    actionNameToHandle = actionNameToHandle.substr(1);
                }
            }
            if (this.charCountMax == null || text.length < this.charCountMax) {
                var textEdited = text.substr(0, this.cursorPos)
                    + actionNameToHandle
                    + text.substr(this.cursorPos);
                text = this.text(textEdited);
                this.cursorPos = NumberHelper.wrapToRangeMinMax(this.cursorPos + 1, 0, text.length + 1);
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
    indexOfFirstLineVisible() {
        return this.scrollbar.sliderPosInItems();
    }
    indexOfLastLineVisible() {
        return this.indexOfFirstLineVisible() + Math.floor(this.scrollbar.windowSizeInItems) - 1;
    }
    indexOfLineSelected(valueToSet) {
        var returnValue = valueToSet;
        if (valueToSet == null) {
            returnValue = this._indexOfLineSelected;
        }
        else {
            this._indexOfLineSelected = valueToSet;
        }
        return returnValue;
    }
    isEnabled() {
        return (this._isEnabled.get());
    }
    text(value) {
        if (value != null) {
            this._text.set(value);
        }
        return this._text.get();
    }
    textAsLines() {
        this._textAsLines = [];
        var charWidthInPixels = this.fontHeightInPixels / 2; // hack
        var charsPerLine = Math.floor(this.size.x / charWidthInPixels);
        var textComplete = this.text(null);
        var textLength = textComplete.length;
        var i = 0;
        while (i < textLength) {
            var line = textComplete.substr(i, charsPerLine);
            this._textAsLines.push(line);
            i += charsPerLine;
        }
        return this._textAsLines;
    }
    mouseClick(clickPos) {
        clickPos = this._mouseClickPos.overwriteWith(clickPos);
        if (clickPos.x - this.pos.x > this.size.x - this.scrollbar.handleSize.x) {
            if (clickPos.y - this.pos.y <= this.scrollbar.handleSize.y) {
                this.scrollbar.scrollUp();
            }
            else if (clickPos.y - this.pos.y >= this.scrollbar.size.y - this.scrollbar.handleSize.y) {
                this.scrollbar.scrollDown();
            }
            else {
                // todo
                /*
                var clickPosRelativeToSlideInPixels = clickPos.subtract
                (
                    this.scrollbar.pos
                ).subtract
                (
                    new Coords(0, this.scrollbar.handleSize.y, 0)
                );
                */
            }
        }
        else {
            var offsetOfLineClicked = clickPos.y - this.pos.y;
            var indexOfLineClicked = this.indexOfFirstLineVisible()
                + Math.floor(offsetOfLineClicked
                    / this.lineSpacing);
            var lines = this.textAsLines();
            if (indexOfLineClicked < lines.length) {
                this.indexOfLineSelected(indexOfLineClicked);
            }
        }
        return true; // wasActionHandled
    }
    scalePosAndSize(scaleFactor) {
        this.pos.multiply(scaleFactor);
        this.size.multiply(scaleFactor);
        this.fontHeightInPixels *= scaleFactor.y;
        this.lineSpacing *= scaleFactor.y;
        this.scrollbar.scalePosAndSize(scaleFactor);
    }
    // drawable
    draw(universe, display, drawLoc, style) {
        drawLoc = this._drawLoc.overwriteWith(drawLoc);
        var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
        var style = style || this.style(universe);
        var colorFore = (this.isHighlighted ? style.colorFill : style.colorBorder);
        var colorBack = (this.isHighlighted ? style.colorBorder : style.colorFill);
        display.drawRectangle(drawPos, this.size, Color.systemColorGet(colorBack), // fill
        Color.systemColorGet(style.colorBorder), // border
        false // areColorsReversed
        );
        var itemSizeY = this.lineSpacing;
        var textMarginLeft = 2;
        var itemPosY = drawPos.y;
        var lines = this.textAsLines();
        if (lines == null || lines.length == 0) {
            return;
        }
        if (this.isHighlighted) {
            // todo - Cursor positioning.
            var lineIndexFinal = lines.length - 1;
            var lineFinal = lines[lineIndexFinal];
            lines[lineIndexFinal] = lineFinal + "_";
        }
        var numberOfLinesVisible = Math.floor(this.size.y / itemSizeY);
        var indexStart = this.indexOfFirstLineVisible();
        var indexEnd = indexStart + numberOfLinesVisible - 1;
        if (indexEnd >= lines.length) {
            indexEnd = lines.length - 1;
        }
        var drawPos2 = new Coords(drawPos.x + textMarginLeft, itemPosY, 0);
        for (var i = indexStart; i <= indexEnd; i++) {
            var line = lines[i];
            display.drawText(line, this.fontHeightInPixels, drawPos2, Color.systemColorGet(colorFore), Color.systemColorGet(colorBack), false, // areColorsReversed
            false, // isCentered
            this.size.x // widthMaxInPixels
            );
            drawPos2.y += itemSizeY;
        }
        this.scrollbar.draw(universe, display, drawLoc, style);
    }
}
