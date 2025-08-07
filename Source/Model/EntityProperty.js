"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EntityPropertyBase {
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return this.constructor.name; }
            updateForTimerTick(uwpe) { }
            clone() { throw new Error("Must be implemented on subclass!"); }
            overwriteWith(other) { throw new Error("Must be implemented on subclass!"); }
            equals(other) { throw new Error("Must be implemented on subclass!"); }
        }
        GameFramework.EntityPropertyBase = EntityPropertyBase;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
