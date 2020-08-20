"use strict";
class ControlLabel extends ControlBase {
    constructor(name, pos, size, isTextCentered, text, fontHeightInPixels) {
        super(name, pos, size, fontHeightInPixels);
        this.isTextCentered = isTextCentered;
        this._text = text;
        // Helper variables.
        this._drawPos = new Coords(0, 0, 0);
    }
    static fromPosAndText(pos, text) {
        return new ControlLabel(null, //name
        pos, null, // size
        false, // isTextCentered
        text, 10 // fontHeightInPixels
        );
    }
    ;
    actionHandle(actionName) {
        return false; // wasActionHandled
    }
    isEnabled() {
        return false;
    }
    mouseClick(pos) {
        return false;
    }
    scalePosAndSize(scaleFactor) {
        this.pos.multiply(scaleFactor);
        this.size.multiply(scaleFactor);
        this.fontHeightInPixels *= scaleFactor.y;
    }
    text() {
        return (this._text.get == null ? this._text : this._text.get());
    }
    // drawable
    draw(universe, display, drawLoc) {
        var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
        var style = this.style(universe);
        var text = this.text();
        if (text != null) {
            var textAsLines = ("" + text).split("\n");
            var widthMaxInPixels = (this.size == null ? null : this.size.x);
            for (var i = 0; i < textAsLines.length; i++) {
                var textLine = textAsLines[i];
                display.drawText(textLine, this.fontHeightInPixels, drawPos, Color.systemColorGet(style.colorBorder), Color.systemColorGet(style.colorFill), // colorOutline
                null, // areColorsReversed
                this.isTextCentered, widthMaxInPixels);
                drawPos.y += this.fontHeightInPixels;
            }
        }
    }
}
