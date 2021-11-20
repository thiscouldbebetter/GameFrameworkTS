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
                return Actor.fromActivityDefnName(GameFramework.ActivityDefn.Instances().DoNothing.name);
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
            // Clonable.
            clone() {
                return new Actor(this.activity.clone());
            }
            overwriteWith(other) {
                this.activity.overwriteWith(other.activity);
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Actor = Actor;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
