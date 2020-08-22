"use strict";
class ActivityDefn {
    constructor(name, perform) {
        this.name = name;
        this._perform = perform;
    }
    static Instances() {
        if (ActivityDefn._instances == null) {
            ActivityDefn._instances = new ActivityDefn_Instances();
        }
        return ActivityDefn._instances;
    }
    perform(u, w, p, e, a) {
        this._perform(u, w, p, e, a);
    }
}
class ActivityDefn_Instances {
    constructor() {
        this.DoNothing = new ActivityDefn("DoNothing", (u, w, p, e, a) => { } // perform
        );
        this._All =
            [
                this.DoNothing
            ];
        this._AllByName = ArrayHelper.addLookupsByName(this._All);
    }
}
