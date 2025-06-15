"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlContainer extends GameFramework.ControlBase {
            constructor(name, pos, size, children, actions, actionToInputsMappings) {
                super(name, pos, size, null);
                this.children = children;
                this.actions = (actions || []);
                this._actionToInputsMappings = actionToInputsMappings || [];
                this._actionToInputsMappingsByInputName = GameFramework.ArrayHelper.addLookupsMultiple(this._actionToInputsMappings, x => x.inputNames);
                this.childrenByName = GameFramework.ArrayHelper.addLookupsByName(this.children);
                this.actionsByName = GameFramework.ArrayHelper.addLookupsByName(this.actions);
                for (var i = 0; i < this.children.length; i++) {
                    var child = this.children[i];
                    child.parent = this;
                }
                this.indexOfChildWithFocus = null;
                this.childrenContainingPos = [];
                this.childrenContainingPosPrev = [];
                // Helper variables.
                this._childMax = GameFramework.Coords.create();
                this._drawPos = GameFramework.Coords.create();
                this._drawLoc = GameFramework.Disposition.fromPos(this._drawPos);
                this._mouseClickPos = GameFramework.Coords.create();
                this._mouseMovePos = GameFramework.Coords.create();
                this._posToCheck = GameFramework.Coords.create();
            }
            static fromNamePosSizeChildren(name, pos, size, children) {
                return new ControlContainer(name, pos, size, children, null, null);
            }
            // instance methods
            // actions
            actionHandle(actionNameToHandle, universe) {
                var wasActionHandled = false;
                var childWithFocus = this.childWithFocus();
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                if (actionNameToHandle == controlActionNames.ControlPrev
                    || actionNameToHandle == controlActionNames.ControlNext) {
                    wasActionHandled = true;
                    var direction = (actionNameToHandle == controlActionNames.ControlPrev ? -1 : 1);
                    if (childWithFocus == null) {
                        childWithFocus = this.childFocusNextInDirection(direction);
                    }
                    else if (childWithFocus.childWithFocus() != null) {
                        childWithFocus.actionHandle(actionNameToHandle, universe);
                        if (childWithFocus.childWithFocus() == null) {
                            childWithFocus = this.childFocusNextInDirection(direction);
                        }
                    }
                    else {
                        childWithFocus.focusLose();
                        childWithFocus = this.childFocusNextInDirection(direction);
                    }
                }
                else if (this._actionToInputsMappingsByInputName.has(actionNameToHandle)) {
                    var inputName = actionNameToHandle; // Likely passed from parent as raw input.
                    var mapping = this._actionToInputsMappingsByInputName.get(inputName);
                    var actionName = mapping.actionName;
                    var action = this.actionsByName.get(actionName);
                    action.performForUniverse(universe);
                    wasActionHandled = true;
                }
                else if (this.actionsByName.has(actionNameToHandle)) {
                    var action = this.actionsByName.get(actionNameToHandle);
                    action.performForUniverse(universe);
                    wasActionHandled = true;
                }
                else if (childWithFocus != null) {
                    if (childWithFocus.actionHandle != null) {
                        wasActionHandled = childWithFocus.actionHandle(actionNameToHandle, universe);
                    }
                }
                return wasActionHandled;
            }
            actionToInputsMappings() {
                return this._actionToInputsMappings;
            }
            childAdd(childToAdd) {
                this.children.push(childToAdd);
                this.childrenByName.set(childToAdd.name, childToAdd);
            }
            childByName(childName) {
                return this.childrenByName.get(childName);
            }
            childFocusNextInDirection(direction) {
                if (this.indexOfChildWithFocus == null) {
                    var iStart = (direction == 1 ? 0 : this.children.length - 1);
                    var iEnd = (direction == 1 ? this.children.length : -1);
                    for (var i = iStart; i != iEnd; i += direction) {
                        var child = this.children[i];
                        if (child.isEnabled()) {
                            this.indexOfChildWithFocus = i;
                            break;
                        }
                    }
                }
                else {
                    while (true) {
                        this.indexOfChildWithFocus += direction;
                        var isChildNextInRange = GameFramework.NumberHelper.isInRangeMinMax(this.indexOfChildWithFocus, 0, this.children.length - 1);
                        if (isChildNextInRange == false) {
                            this.indexOfChildWithFocus = null;
                            break;
                        }
                        else {
                            var child = this.children[this.indexOfChildWithFocus];
                            if (child.isEnabled()) {
                                break;
                            }
                        }
                    } // end while (true)
                } // end if
                var returnValue = this.childWithFocus();
                if (returnValue != null) {
                    returnValue.focusGain();
                }
                return returnValue;
            }
            childWithFocus() {
                return (this.indexOfChildWithFocus == null ? null : this.children[this.indexOfChildWithFocus]);
            }
            childrenAtPosAddToList(posToCheck, listToAddTo, addFirstChildOnly) {
                posToCheck = this._posToCheck.overwriteWith(posToCheck).clearZ();
                for (var i = this.children.length - 1; i >= 0; i--) {
                    var child = this.children[i];
                    var childPos = child.pos;
                    var childSize = child.size || GameFramework.Coords.zeroes();
                    var childMax = this._childMax.overwriteWith(childPos).add(childSize);
                    var doesChildContainPos = posToCheck.isInRangeMinMax(childPos, childMax);
                    if (doesChildContainPos) {
                        listToAddTo.push(child);
                        if (addFirstChildOnly) {
                            break;
                        }
                    }
                }
                return listToAddTo;
            }
            childrenLayOutWithSpacingAlongDimension(spacing, dimensionIndex) {
                var axis = GameFramework.Coords.zeroes().dimensionSet(dimensionIndex, 1);
                var spacingAlongAxis = spacing.clone().multiply(axis);
                var childPos = spacing.clone();
                for (var i = 0; i < this.children.length; i++) {
                    var child = this.children[i];
                    child.pos.overwriteWith(childPos);
                    childPos.add(child.size.clone().multiply(axis)).add(spacingAlongAxis);
                }
                return this;
            }
            childrenLayOutWithSpacingVertically(spacing) {
                return this.childrenLayOutWithSpacingAlongDimension(spacing, 1);
            }
            focusGain() {
                this.indexOfChildWithFocus = null;
                var childWithFocus = this.childFocusNextInDirection(1);
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
                var childrenContainingPos = this.childrenAtPosAddToList(mouseClickPos, GameFramework.ArrayHelper.clear(this.childrenContainingPos), false // addFirstChildOnly
                );
                var wasClickHandled = false;
                for (var i = 0; i < childrenContainingPos.length; i++) {
                    var child = childrenContainingPos[i];
                    var wasClickHandledByChild = child.mouseClick(mouseClickPos);
                    if (wasClickHandledByChild) {
                        wasClickHandled = true;
                    }
                }
                return wasClickHandled;
            }
            mouseMove(mouseMovePos) {
                var temp = this.childrenContainingPosPrev;
                this.childrenContainingPosPrev = this.childrenContainingPos;
                this.childrenContainingPos = temp;
                mouseMovePos = this._mouseMovePos.overwriteWith(mouseMovePos).subtract(this.pos);
                var childrenContainingPos = this.childrenAtPosAddToList(mouseMovePos, GameFramework.ArrayHelper.clear(this.childrenContainingPos), true // addFirstChildOnly
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
                return false; // wasMoveHandled
            }
            scalePosAndSize(scaleFactor) {
                super.scalePosAndSize(scaleFactor);
                for (var i = 0; i < this.children.length; i++) {
                    var child = this.children[i];
                    if (child.scalePosAndSize == null) {
                        child.pos.multiply(scaleFactor);
                        child.size.multiply(scaleFactor);
                        if (child.fontNameAndHeight != null) {
                            child.fontNameAndHeight.heightInPixels *= scaleFactor.y;
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
            toControlContainerTransparent() {
                return new GameFramework.ControlContainerTransparent(this);
            }
            // Drawable.
            finalize(universe) {
                this.children.forEach(x => x.finalize(universe));
            }
            finalizeIsComplete() {
                var childrenAreAllFinalized = (this.children.some(x => x.finalizeIsComplete() == false) == false);
                return childrenAreAllFinalized;
            }
            initialize(universe) {
                this.children.forEach(x => x.initialize(universe));
            }
            initializeIsComplete(universe) {
                var childrenAreAllInitialized = (this.children.some(x => x.initializeIsComplete(universe) == false) == false);
                return childrenAreAllInitialized;
            }
            draw(universe, display, drawLoc, style) {
                drawLoc = this._drawLoc.overwriteWith(drawLoc);
                var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
                style = style || this.style(universe);
                style.drawBoxOfSizeAtPosWithColorsToDisplay(this.size, drawPos, style.colorBackground(), style.colorBorder(), false, // isHighlighted,
                display);
                var children = this.children;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    child.draw(universe, display, drawLoc, style);
                }
            }
        }
        GameFramework.ControlContainer = ControlContainer;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
