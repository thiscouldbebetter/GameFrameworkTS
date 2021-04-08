"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
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
            perform(u, w, p, e) {
                this._perform(u, w, p, e);
            }
        }
        GameFramework.ActivityDefn = ActivityDefn;
        class ActivityDefn_Instances {
            constructor() {
                this.DoNothing = new ActivityDefn("DoNothing", 
                // perform
                (u, w, p, e) => { });
                this.HandleUserInput = new ActivityDefn("HandleUserInput", (universe, world, place, entity) => {
                    var inputHelper = universe.inputHelper;
                    var placeDefn = place.defn(world);
                    var actionsByName = placeDefn.actionsByName;
                    var actionToInputsMappingsByInputName = placeDefn.actionToInputsMappingsByInputName;
                    var actionsToPerform = inputHelper.actionsFromInput(actionsByName, actionToInputsMappingsByInputName);
                    for (var i = 0; i < actionsToPerform.length; i++) {
                        var action = actionsToPerform[i];
                        action.perform(universe, world, place, entity);
                    }
                });
                this.Simultaneous = new ActivityDefn("Simultaneous", 
                // perform
                (u, w, p, e) => {
                    var activity = e.actor().activity;
                    var childActivities = activity.target;
                    childActivities = childActivities.filter(x => x.isDone == false);
                    activity.target = childActivities;
                    for (var i = 0; i < childActivities.length; i++) {
                        var childActivity = childActivities[i];
                        childActivity.perform(u, w, p, e);
                    }
                });
                this._All =
                    [
                        this.DoNothing,
                        this.HandleUserInput,
                        this.Simultaneous
                    ];
                this._AllByName = GameFramework.ArrayHelper.addLookupsByName(this._All);
            }
        }
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
