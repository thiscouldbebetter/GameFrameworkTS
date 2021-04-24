"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlContainerTransparent extends GameFramework.ControlBase {
            constructor(containerInner) {
                super(containerInner.name, containerInner.pos, containerInner.size, containerInner.fontHeightInPixels);
                this.containerInner = containerInner;
            }
            // instance methods
            actionToInputsMappings() {
                return this.containerInner.actionToInputsMappings();
            }
            childWithFocus() {
                return this.containerInner.childWithFocus();
            }
            childWithFocusNextInDirection(direction) {
                return this.containerInner.childWithFocusNextInDirection(direction);
            }
            childrenAtPosAddToList(posToCheck, listToAddTo, addFirstChildOnly) {
                return this.containerInner.childrenAtPosAddToList(posToCheck, listToAddTo, addFirstChildOnly);
            }
            actionHandle(actionNameToHandle, universe) {
                return this.containerInner.actionHandle(actionNameToHandle, universe);
            }
            isEnabled() {
                return true; // todo
            }
            mouseClick(mouseClickPos) {
                var childrenContainingPos = this.containerInner.childrenAtPosAddToList(mouseClickPos, GameFramework.ArrayHelper.clear(this.containerInner.childrenContainingPos), true // addFirstChildOnly
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
                return this.containerInner.mouseMove(mouseMovePos);
            }
            scalePosAndSize(scaleFactor) {
                return this.containerInner.scalePosAndSize(scaleFactor);
            }
            // drawable
            draw(universe, display, drawLoc, style) {
                if (this.isVisible() == false) {
                    return;
                }
                drawLoc = this.containerInner._drawLoc.overwriteWith(drawLoc);
                var drawPos = this.containerInner._drawPos.overwriteWith(drawLoc.pos).add(this.containerInner.pos);
                style = style || this.style(universe);
                display.drawRectangle(drawPos, this.containerInner.size, null, // display.colorBack,
                style.colorBorder, null);
                var children = this.containerInner.children;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    child.draw(universe, display, drawLoc, style);
                }
            }
        }
        GameFramework.ControlContainerTransparent = ControlContainerTransparent;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
