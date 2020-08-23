"use strict";
class ControlBase {
    constructor(name, pos, size, fontHeightInPixels) {
        this.name = name;
        this.pos = pos;
        this.size = size;
        this.fontHeightInPixels = fontHeightInPixels;
        this.isHighlighted = false;
    }
    actionHandle(actionName, universe) { return false; }
    actionToInputsMappings() { return new Array(); }
    childWithFocus() { return null; }
    draw(u, d, drawLoc) { }
    focusGain() { this.isHighlighted = true; }
    focusLose() { this.isHighlighted = false; }
    isEnabled() { return true; }
    mouseClick(x) { return false; }
    mouseEnter() { this.isHighlighted = true; }
    mouseExit() { this.isHighlighted = false; }
    mouseMove(x) { }
    scalePosAndSize(x) { }
    style(universe) {
        return universe.controlStyle; // todo
    }
}
