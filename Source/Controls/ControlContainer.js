"use strict";
class ControlContainer extends ControlBase {
    constructor(name, pos, size, children, actions, actionToInputsMappings) {
        super(name, pos, size, null);
        this.children = children;
        this.actions = (actions || []);
        this._actionToInputsMappings = actionToInputsMappings || [];
        this._actionToInputsMappingsByInputName = ArrayHelper.addLookupsMultiple(this._actionToInputsMappings, x => x.inputNames);
        this.childrenByName = ArrayHelper.addLookupsByName(this.children);
        this.actionsByName = ArrayHelper.addLookupsByName(this.actions);
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            child.parent = this;
        }
        this.indexOfChildWithFocus = null;
        this.childrenContainingPos = [];
        this.childrenContainingPosPrev = [];
        // Helper variables.
        this._childMax = new Coords(0, 0, 0);
        this._drawPos = new Coords(0, 0, 0);
        this._drawLoc = new Disposition(this._drawPos, null, null);
        this._mouseClickPos = new Coords(0, 0, 0);
        this._mouseMovePos = new Coords(0, 0, 0);
        this._posToCheck = new Coords(0, 0, 0);
    }
    // instance methods
    // actions
    actionHandle(actionNameToHandle, universe) {
        var wasActionHandled = false;
        var childWithFocus = this.childWithFocus();
        var controlActionNames = ControlActionNames.Instances();
        if (actionNameToHandle == controlActionNames.ControlPrev
            || actionNameToHandle == controlActionNames.ControlNext) {
            wasActionHandled = true;
            var direction = (actionNameToHandle == controlActionNames.ControlPrev ? -1 : 1);
            if (childWithFocus == null) {
                childWithFocus = this.childWithFocusNextInDirection(direction);
                if (childWithFocus != null) {
                    childWithFocus.focusGain();
                }
            }
            else if (childWithFocus.childWithFocus() != null) {
                childWithFocus.actionHandle(actionNameToHandle, universe);
                if (childWithFocus.childWithFocus() == null) {
                    childWithFocus = this.childWithFocusNextInDirection(direction);
                    if (childWithFocus != null) {
                        childWithFocus.focusGain();
                    }
                }
            }
            else {
                childWithFocus.focusLose();
                childWithFocus = this.childWithFocusNextInDirection(direction);
                if (childWithFocus != null) {
                    childWithFocus.focusGain();
                }
            }
        }
        else if (this._actionToInputsMappingsByInputName.has(actionNameToHandle)) {
            var inputName = actionNameToHandle; // Likely passed from parent as raw input.
            var mapping = this._actionToInputsMappingsByInputName.get(inputName);
            var actionName = mapping.actionName;
            var action = this.actionsByName.get(actionName);
            action.perform(universe, null, null, null);
            wasActionHandled = true;
        }
        else if (this.actionsByName.has(actionNameToHandle)) {
            var action = this.actionsByName.get(actionNameToHandle);
            action.perform(universe, null, null, null);
            wasActionHandled = true;
        }
        else if (childWithFocus != null) {
            if (childWithFocus.actionHandle != null) {
                wasActionHandled = childWithFocus.actionHandle(actionNameToHandle, universe);
            }
        }
        return wasActionHandled;
    }
    ;
    actionToInputsMappings() {
        return this._actionToInputsMappings;
    }
    childWithFocus() {
        return (this.indexOfChildWithFocus == null ? null : this.children[this.indexOfChildWithFocus]);
    }
    childWithFocusNextInDirection(direction) {
        if (this.indexOfChildWithFocus == null) {
            var iStart = (direction == 1 ? 0 : this.children.length - 1);
            var iEnd = (direction == 1 ? this.children.length : -1);
            for (var i = iStart; i != iEnd; i += direction) {
                var child = this.children[i];
                if (child.focusGain != null
                    && (child.isEnabled())) {
                    this.indexOfChildWithFocus = i;
                    break;
                }
            }
        }
        else {
            while (true) {
                this.indexOfChildWithFocus += direction;
                var isChildNextInRange = NumberHelper.isInRangeMinMax(this.indexOfChildWithFocus, 0, this.children.length - 1);
                if (isChildNextInRange == false) {
                    this.indexOfChildWithFocus = null;
                    break;
                }
                else {
                    var child = this.children[this.indexOfChildWithFocus];
                    if (child.focusGain != null
                        && (child.isEnabled == null || child.isEnabled())) {
                        break;
                    }
                }
            } // end while (true)
        } // end if
        var returnValue = this.childWithFocus();
        return returnValue;
    }
    childrenAtPosAddToList(posToCheck, listToAddTo, addFirstChildOnly) {
        posToCheck = this._posToCheck.overwriteWith(posToCheck).clearZ();
        for (var i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];
            var doesChildContainPos = posToCheck.isInRangeMinMax(child.pos, this._childMax.overwriteWith(child.pos).add(child.size));
            if (doesChildContainPos) {
                listToAddTo.push(child);
                if (addFirstChildOnly) {
                    break;
                }
            }
        }
        return listToAddTo;
    }
    focusGain() {
        this.indexOfChildWithFocus = null;
        var childWithFocus = this.childWithFocusNextInDirection(1);
        if (childWithFocus != null) {
            childWithFocus.focusGain();
        }
    }
    focusLose() {
        var childWithFocus = this.childWithFocus();
        if (childWithFocus != null) {
            childWithFocus.focusLose();
            this.indexOfChildWithFocus = null;
        }
    }
    mouseClick(mouseClickPos) {
        mouseClickPos = this._mouseClickPos.overwriteWith(mouseClickPos).subtract(this.pos);
        var childrenContainingPos = this.childrenAtPosAddToList(mouseClickPos, ArrayHelper.clear(this.childrenContainingPos), true // addFirstChildOnly
        );
        var wasClickHandled = false;
        if (childrenContainingPos.length > 0) {
            var child = childrenContainingPos[0];
            if (child.mouseClick != null) {
                var wasClickHandledByChild = child.mouseClick(mouseClickPos);
                if (wasClickHandledByChild) {
                    wasClickHandled = true;
                }
            }
        }
        return wasClickHandled;
    }
    mouseMove(mouseMovePos) {
        var temp = this.childrenContainingPosPrev;
        this.childrenContainingPosPrev = this.childrenContainingPos;
        this.childrenContainingPos = temp;
        mouseMovePos = this._mouseMovePos.overwriteWith(mouseMovePos).subtract(this.pos);
        var childrenContainingPos = this.childrenAtPosAddToList(mouseMovePos, ArrayHelper.clear(this.childrenContainingPos), true // addFirstChildOnly
        );
        for (var i = 0; i < childrenContainingPos.length; i++) {
            var child = childrenContainingPos[i];
            if (child.mouseMove != null) {
                child.mouseMove(mouseMovePos);
            }
            if (this.childrenContainingPosPrev.indexOf(child) == -1) {
                if (child.mouseEnter != null) {
                    child.mouseEnter();
                }
            }
        }
        for (var i = 0; i < this.childrenContainingPosPrev.length; i++) {
            var child = this.childrenContainingPosPrev[i];
            if (childrenContainingPos.indexOf(child) == -1) {
                if (child.mouseExit != null) {
                    child.mouseExit();
                }
            }
        }
    }
    scalePosAndSize(scaleFactor) {
        this.pos.multiply(scaleFactor);
        this.size.multiply(scaleFactor);
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            if (child.scalePosAndSize == null) {
                child.pos.multiply(scaleFactor);
                child.size.multiply(scaleFactor);
                if (child.fontHeightInPixels != null) {
                    child.fontHeightInPixels *= scaleFactor.y;
                }
            }
            else {
                child.scalePosAndSize(scaleFactor);
            }
        }
        return this;
    }
    shiftChildPositions(displacement) {
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            child.pos.add(displacement);
        }
    }
    toVenue() {
        return new VenueFader(new VenueControls(this, false), null, null, null);
    }
    // drawable
    draw(universe, display, drawLoc, style) {
        drawLoc = this._drawLoc.overwriteWith(drawLoc);
        var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
        style = style || this.style(universe);
        display.drawRectangle(drawPos, this.size, Color.systemColorGet(style.colorBackground), Color.systemColorGet(style.colorBorder), null);
        var children = this.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            child.draw(universe, display, drawLoc, style);
        }
    }
}
