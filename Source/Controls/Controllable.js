"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Controllable {
            constructor(toControl) {
                this.toControl = toControl;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
        }
        GameFramework.Controllable = Controllable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
