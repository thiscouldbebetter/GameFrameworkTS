"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlContainerTransparent extends GameFramework.ControlBase {
            constructor(containerInner) {
                super(containerInner.name, containerInner.pos, containerInner.size, containerInner.fontNameAndHeight);
                this.containerInner = containerInner;
            }
            // instance methods
            actionHandle(actionNameToHandle, universe) {
                return this.containerInner.actionHandle(actionNameToHandle, universe);
            }
            actionToInputsMappings() {
                return this.containerInner.actionToInputsMappings();
            }
            childWithFocus() {
                return this.containerInner.childWithFocus();
            }
            childFocusNextInDirection(direction) {
                return this.containerInner.childFocusNextInDirection(direction);
            }
            childrenAtPosAddToList(posToCheck, listToAddTo, addFirstChildOnly) {
                return this.containerInner.childrenAtPosAddToList(posToCheck, listToAddTo, addFirstChildOnly);
            }
            focusGain() {
                this.containerInner.focusGain();
            }
            focusLose() {
                this.containerInner.focusLose();
            }
            isEnabled() {
                return this.containerInner.isEnabled();
            }
            mouseClick(mouseClickPos) {
                return this.containerInner.mouseClick(mouseClickPos);
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
                this.containerInner._drawPos.overwriteWith(drawLoc.pos).add(this.containerInner.pos);
                style = style || this.style(universe);
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
