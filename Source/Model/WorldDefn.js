"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class WorldDefn {
            constructor(actions, activityDefns, entityDefns, itemDefns, placeDefns, skills) {
                this.actions = actions || [];
                this.activityDefns = activityDefns || [];
                this.entityDefns = entityDefns || [];
                this.itemDefns = itemDefns || [];
                this.placeDefns = placeDefns || [];
                this.skills = skills || [];
                this.actionsByName = GameFramework.ArrayHelper.addLookupsByName(this.actions);
                this.activityDefnsByName = GameFramework.ArrayHelper.addLookupsByName(this.activityDefns);
                this.entityDefnsByName = GameFramework.ArrayHelper.addLookupsByName(this.entityDefns);
                this.itemDefnsByName = GameFramework.ArrayHelper.addLookupsByName(this.itemDefns);
                this.placeDefnsByName = GameFramework.ArrayHelper.addLookupsByName(this.placeDefns);
                this.skillsByName = GameFramework.ArrayHelper.addLookupsByName(this.skills);
            }
            static default() {
                return new WorldDefn(null, null, null, null, null, null);
            }
            static fromPlaceDefns(placeDefns) {
                return new WorldDefn([], [], [], [], placeDefns, []);
            }
            // Convenience methods.
            actionByName(defnName) {
                var returnValue = this.actionsByName.get(defnName);
                return returnValue;
            }
            activityDefnByName(defnName) {
                var returnValue = this.activityDefnsByName.get(defnName);
                return returnValue;
            }
            entityDefnByName(defnName) {
                var returnValue = this.entityDefnsByName.get(defnName);
                return returnValue;
            }
            itemDefnByName(defnName) {
                var returnValue = this.itemDefnsByName.get(defnName);
                return returnValue;
            }
            placeDefnByName(defnName) {
                var returnValue = this.placeDefnsByName.get(defnName);
                return returnValue;
            }
        }
        GameFramework.WorldDefn = WorldDefn;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
