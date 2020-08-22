"use strict";
class Activity {
    constructor(defnName, target) {
        this.defnName = defnName;
        this.target = target;
    }
    defn(world) {
        return world.defn.activityDefnsByName().get(this.defnName);
    }
    perform(u, w, p, e) {
        this.defn(w).perform(u, w, p, e, this);
    }
}
