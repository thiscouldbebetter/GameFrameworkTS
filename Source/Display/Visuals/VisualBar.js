"use strict";
class VisualBar {
    constructor(abbreviation, size, color, amountCurrent, amountMax, fractionBelowWhichToShow) {
        this.abbreviation = abbreviation;
        this.size = size;
        this.color = color;
        this.amountCurrent = amountCurrent;
        this.amountMax = amountMax;
        this.fractionBelowWhichToShow = fractionBelowWhichToShow;
        this._drawPos = new Coords(0, 0, 0);
        this._sizeCurrent = this.size.clone();
        this._sizeHalf = this.size.clone().half();
    }
    draw(universe, world, place, entity, display) {
        var wasVisible = false;
        var pos = this._drawPos.overwriteWith(entity.locatable().loc.pos).subtract(this._sizeHalf);
        var _amountCurrent = this.amountCurrent.contextSet(entity).get();
        var _amountMax = this.amountMax.contextSet(entity).get();
        var fractionCurrent = _amountCurrent / _amountMax;
        var shouldShow = (this.fractionBelowWhichToShow == null
            || fractionCurrent < this.fractionBelowWhichToShow);
        if (shouldShow) {
            wasVisible = true;
            var widthCurrent = fractionCurrent * this.size.x;
            this._sizeCurrent.x = widthCurrent;
            display.drawRectangle(pos, this._sizeCurrent, this.color.systemColor(), null, null);
            var colorForBorder = null;
            var colors = Color.Instances();
            if (fractionCurrent < .33) {
                colorForBorder = colors.Red;
            }
            else if (fractionCurrent < .67) {
                colorForBorder = colors.Yellow;
            }
            else {
                colorForBorder = colors.White;
            }
            display.drawRectangle(pos, this.size, null, colorForBorder.systemColor(), null);
            pos.add(this._sizeHalf);
            var remainingOverMax = Math.round(_amountCurrent) + "/" + _amountMax;
            var text = this.abbreviation + ":" + remainingOverMax;
            display.drawText(text, this.size.y, // fontHeightInPixels
            pos, colorForBorder.systemColor(), "Black", // colorOutline,
            false, // areColorsReversed
            true, // isCentered
            null);
        }
        return wasVisible;
    }
    // Clonable.
    clone() {
        return this; // todo
    }
    overwriteWith(other) {
        return this; // todo
    }
    // Transformable.
    transform(transformToApply) {
        return this; // todo
    }
}
