"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Actor {
            constructor(activity) {
                this.activity = activity;
                this.actions = [];
            }
            static fromActivityDefnName(activityDefnName) {
                var activity = GameFramework.Activity.fromDefnName(activityDefnName);
                var returnValue = new Actor(activity);
                return returnValue;
            }
            // EntityProperty.
            finalize(u, w, p, e) { }
            initialize(u, w, p, e) { }
            updateForTimerTick(universe, world, place, entity) {
                this.activity.perform(universe, world, place, entity);
            }
        }
        GameFramework.Actor = Actor;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
