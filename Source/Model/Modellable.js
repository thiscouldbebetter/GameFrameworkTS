"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Modellable extends GameFramework.EntityProperty {
            constructor(model) {
                super();
                this.model = model;
            }
            updateForTimerTick(universe, world, place, entity) {
                // Do nothing.
            }
        }
        GameFramework.Modellable = Modellable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
