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
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Actor.name; }
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
