"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualErase {
            constructor(child) {
                this.child = child;
            }
            draw(uwpe, display) {
                display.stateSave();
                display.eraseModeSet(true);
                this.child.draw(uwpe, display);
                display.eraseModeSet(false);
                display.stateRestore();
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
        GameFramework.VisualErase = VisualErase;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
