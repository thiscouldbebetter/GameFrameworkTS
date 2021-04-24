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
            defn(world) {
                return world.defn.activityDefnByName(this.defnName);
            }
            defnNameAndTargetSet(defnName, target) {
                this.defnName = defnName;
                this.targetSet(target);
                return this;
            }
            perform(u, w, p, e) {
                if (this.defnName != null) {
                    var defn = this.defn(w);
                    defn.perform(u, w, p, e);
                }
            }
            target() {
                return this.targetByName(this.defnName);
            }
            targetByName(targetName) {
                return this.targetsByName.get(targetName);
            }
            targetSet(value) {
                this.targetsByName.set(this.defnName, value);
                return this;
            }
            targetSetByName(name, value) {
                this.targetsByName.set(name, value);
                return this;
            }
        }
        GameFramework.Activity = Activity;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
