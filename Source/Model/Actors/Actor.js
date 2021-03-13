"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Actor extends GameFramework.EntityProperty {
            constructor(activity) {
                super();
                this.activity = activity;
                this.actions = [];
            }
            updateForTimerTick(universe, world, place, entity) {
                this.activity.perform(universe, world, place, entity);
            }
        }
        GameFramework.Actor = Actor;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
