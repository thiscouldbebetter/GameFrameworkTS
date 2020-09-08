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
        this.DoNothing = new ActivityDefn("DoNothing", 
        // perform
        (u, w, p, e, a) => { });
        this.Simultaneous = new ActivityDefn("Simultaneous", 
        // perform
        (u, w, p, e, a) => {
            var childActivities = a.target;
            childActivities = childActivities.filter(x => x.isDone == false);
            a.target = childActivities;
            for (var i = 0; i < childActivities.length; i++) {
                var childActivity = childActivities[i];
                childActivity.perform(u, w, p, e);
            }
        });
        this._All =
            [
                this.DoNothing,
                this.Simultaneous
            ];
        this._AllByName = ArrayHelper.addLookupsByName(this._All);
    }
}
