"use strict";
class Activity {
    constructor(defnName, target) {
        this.defnName = defnName;
        this.target = target;
        this.isDone = false;
    }
    defn(world) {
        return world.defn.activityDefnsByName().get(this.defnName);
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
