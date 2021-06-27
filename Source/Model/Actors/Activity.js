"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Activity {
            constructor(defnName, targetsByName) {
                this.defnName = defnName;
                this.targetsByName = targetsByName || new Map([]);
            }
            static fromDefnName(defnName) {
                return new Activity(defnName, null);
            }
            static fromDefnNameAndTarget(defnName, target) {
                return new Activity(defnName, new Map([
                    [defnName, target]
                ]));
            }
            clear() {
                this.defnName = GameFramework.ActivityDefn.Instances().DoNothing.name;
                this.targetClear();
                return this;
            }
            defn(world) {
                return world.defn.activityDefnByName(this.defnName);
            }
            defnNameAndTargetSet(defnName, target) {
                this.defnName = defnName;
                this.targetSet(target);
                return this;
            }
            perform(uwpe) {
                if (this.defnName != null) {
                    var defn = this.defn(uwpe.world);
                    defn.perform(uwpe);
                }
            }
            target() {
                return this.targetByName(this.defnName);
            }
            targetByName(targetName) {
                return this.targetsByName.get(targetName);
            }
            targetClear() {
                this.targetClearByName(this.defnName);
                return this;
            }
            targetClearByName(name) {
                this.targetsByName.delete(name);
                return this;
            }
            targetSet(value) {
                this.targetSetByName(this.defnName, value);
                return this;
            }
            targetSetByName(name, value) {
                this.targetsByName.set(name, value);
                return this;
            }
            // Clonable.
            clone() {
                return Activity.fromDefnName(this.defnName);
            }
            overwriteWith(other) {
                this.defnName = other.defnName;
                return this;
            }
        }
        GameFramework.Activity = Activity;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
