"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlBase {
            constructor(name, pos, size, fontHeightInPixels) {
                this.name = name;
                this.pos = pos;
                this.size = size;
                this.fontHeightInPixels = fontHeightInPixels;
                this._isVisible = true;
                this.styleName = null;
                this.isHighlighted = false;
            }
            actionHandle(actionName, universe) { return false; }
            actionToInputsMappings() { return new Array(); }
            childWithFocus() { return null; }
            draw(u, d, drawLoc, style) { }
            focusGain() { this.isHighlighted = true; }
            focusLose() { this.isHighlighted = false; }
            isEnabled() { return true; }
            isVisible() { return this._isVisible; }
            mouseClick(x) { return false; }
            mouseEnter() { this.isHighlighted = true; }
            mouseExit() { this.isHighlighted = false; }
            mouseMove(x) { return false; }
            scalePosAndSize(x) { }
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
