"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Actor extends GameFramework.EntityPropertyBase {
            constructor(activity) {
                super();
                this.activity = activity;
                this.actions = [];
            }
            static default() {
                return Actor.fromActivityDefn(GameFramework.ActivityDefn.Instances().DoNothing);
            }
            static fromActivity(activity) {
                return new Actor(activity);
            }
            static fromActivityDefn(activityDefn) {
                return Actor.fromActivityDefnName(activityDefn.name);
            }
            static fromActivityDefnName(activityDefnName) {
                var activity = GameFramework.Activity.fromDefnName(activityDefnName);
                var returnValue = new Actor(activity);
                return returnValue;
            }
            static of(entity) {
                return entity.propertyByName(Actor.name);
            }
            updateForTimerTick(uwpe) {
                this.activity.perform(uwpe);
                this.actions.forEach(x => x.perform(uwpe));
                this.actions.length = 0; // What about long-running actions?
            }
            // Clonable.
            clone() {
                return new Actor(this.activity.clone());
            }
            overwriteWith(other) {
                this.activity.overwriteWith(other.activity);
                return this;
            }
        }
        GameFramework.Actor = Actor;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
