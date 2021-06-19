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
            static create() {
                return new Actor(null);
            }
            static fromActivityDefnName(activityDefnName) {
                var activity = GameFramework.Activity.fromDefnName(activityDefnName);
                var returnValue = new Actor(activity);
                return returnValue;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) {
                this.activity.perform(uwpe);
            }
        }
        GameFramework.Actor = Actor;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
