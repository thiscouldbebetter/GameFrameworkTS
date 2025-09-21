"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualBase {
            draw(uwpe, display) { throw new Error("Must be implemented in subclass!"); }
            initialize(uwpe) { }
            initializeIsComplete(uwpe) { return true; }
            // Clonable.
            clone() { throw new Error("Must be implemented on subclass!"); }
            overwriteWith(other) { throw new Error("Must be implemented on subclass!"); }
            equals(other) { throw new Error("Must be implemented on subclass!"); }
            // Transformable.
            transform(transformToApply) { throw new Error("Must be implemented in subclass!"); }
        }
        GameFramework.VisualBase = VisualBase;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
