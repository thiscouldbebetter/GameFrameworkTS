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
                    this.defn(w).perform(u, w, p, e, this);
                }
            }
        }
        GameFramework.Activity = Activity;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
