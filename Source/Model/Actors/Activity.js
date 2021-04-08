"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Activity {
            constructor(defnName, target) {
                this.defnName = defnName;
                this.target = target;
                this.isDone = false;
            }
            static fromDefnName(defnName) {
                return new Activity(defnName, null);
            }
            defn(world) {
                return world.defn.activityDefnByName(this.defnName);
            }
            defnNameAndTargetSet(defnName, target) {
                this.defnName = defnName;
                this.target = target;
                return this;
            }
            perform(u, w, p, e) {
                if (this.defnName != null) {
                    var defn = this.defn(w);
                    defn.perform(u, w, p, e);
                }
            }
        }
        GameFramework.Activity = Activity;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
