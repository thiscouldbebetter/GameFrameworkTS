"use strict";
class ControlButton extends ControlBase {
    constructor(name, pos, size, text, fontHeightInPixels, hasBorder, isEnabled, click, context, canBeHeldDown) {
        super(name, pos, size, fontHeightInPixels);
        this.text = text;
        this.hasBorder = hasBorder;
        this._isEnabled = isEnabled;
        this.click = click;
        this.context = context;
        this.canBeHeldDown = (canBeHeldDown == null ? false : canBeHeldDown);
        // Helper variables.
        this._drawLoc = new Disposition(new Coords(0, 0, 0), Orientation.default(), null);
        this._sizeHalf = new Coords(0, 0, 0);
    }
    actionHandle(actionNameToHandle, universe) {
        if (actionNameToHandle == ControlActionNames.Instances().ControlConfirm) {
            this.click(this.context);
        }
        return (this.canBeHeldDown == false); // wasActionHandled
    }
    ;
    actionToInputsMappings() {
        return null; // todo
    }
    childWithFocus() {
        return null;
    }
    isEnabled() {
        return (this._isEnabled.get == null ? this._isEnabled : this._isEnabled.get());
    }
    ;
    // events
    mouseClick(clickPos) {
        if (this.isEnabled()) {
            this.click(this.context);
        }
        return (this.canBeHeldDown == false); // wasClickHandled
    }
    ;
    scalePosAndSize(scaleFactor) {
        this.pos.multiply(scaleFactor);
        this.size.multiply(scaleFactor);
        this.fontHeightInPixels *= scaleFactor.y;
    }
    ;
    style(universe) {
        return universe.controlBuilder.stylesByName.get(this.styleName == null ? "Default" : this.styleName);
    }
    ;
    // drawable
    draw(universe, display, drawLoc) {
        var drawPos = this._drawLoc.overwriteWith(drawLoc).pos;
        drawPos.add(this.pos);
        var isEnabled = this.isEnabled();
        var isHighlighted = this.isHighlighted && isEnabled;
        var style = this.style(universe);
        var colorFill = style.colorFill;
        var colorBorder = style.colorBorder;
        if (this.hasBorder) {
            display.drawRectangle(drawPos, this.size, Color.systemColorGet(colorFill), Color.systemColorGet(colorBorder), isHighlighted // areColorsReversed
            );
        }
        drawPos.add(this._sizeHalf.overwriteWith(this.size).half());
        var colorText = (isEnabled ? colorBorder : style.colorDisabled);
        display.drawText(this.text, this.fontHeightInPixels, drawPos, Color.systemColorGet(colorText), Color.systemColorGet(colorFill), isHighlighted, true, // isCentered
        this.size.x // widthMaxInPixels
        );
    }
    ;
}
