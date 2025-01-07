"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlBase {
            constructor(name, pos, size, fontNameAndHeight) {
                this.name = name;
                this.pos = pos;
                this.size = size;
                this.fontNameAndHeight =
                    fontNameAndHeight == null ? null : fontNameAndHeight.clone(); // hack
                this._isVisible = true;
                this.styleName = null;
                this.isHighlighted = false;
            }
            // Setters.
            fontNameAndHeightSet(value) {
                this.fontNameAndHeight.overwriteWith(value);
                return this;
            }
            posSet(value) {
                this.pos.overwriteWith(value);
                return this;
            }
            sizeSet(value) {
                this.size.overwriteWith(value);
                return this;
            }
            // Events.
            actionHandle(actionName, universe) { return false; }
            focusGain() { this.isHighlighted = true; }
            focusLose() { this.isHighlighted = false; }
            mouseClick(x) { return false; }
            mouseEnter() { this.isHighlighted = true; }
            mouseExit() { this.isHighlighted = false; }
            mouseMove(x) { return false; }
            // Other methods.
            actionToInputsMappings() { return new Array(); }
            childWithFocus() { return null; }
            draw(u, d, drawLoc, style) { }
            finalize(u) { }
            initialize(u) { }
            isEnabled() { return true; }
            isVisible() { return this._isVisible; }
            scalePosAndSize(scaleFactors) {
                this.pos.multiply(scaleFactors);
                this.size.multiply(scaleFactors);
                if (this.fontNameAndHeight != null) {
                    this.fontNameAndHeight.heightInPixels *= scaleFactors.y;
                }
                return this;
            }
            style(universe) {
                var returnValue = (this.styleName == null
                    ? universe.controlBuilder.styleDefault()
                    : universe.controlBuilder.styleByName(this.styleName));
                return returnValue;
            }
            toVenue() { return GameFramework.VenueControls.fromControl(this); }
        }
        GameFramework.ControlBase = ControlBase;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
