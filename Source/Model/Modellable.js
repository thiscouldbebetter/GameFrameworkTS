"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Modellable {
            constructor(model) {
                this.model = model;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) {
                // Do nothing.
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Modellable = Modellable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
