"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class WorldDefn {
            constructor(defnArrays) {
                this.defnArraysByTypeName = new Map();
                this.defnsByNameByTypeName = new Map();
                for (var i = 0; i < defnArrays.length; i++) {
                    var defnsOfType = defnArrays[i];
                    var defnsByName = GameFramework.ArrayHelper.addLookupsByName(defnsOfType);
                    var itemFirst = defnsOfType[0];
                    var itemTypeName = itemFirst.constructor.name;
                    this.defnArraysByTypeName.set(itemTypeName, defnsOfType);
                    this.defnsByNameByTypeName.set(itemTypeName, defnsByName);
                }
            }
            // Convenience methods.
            actionDefnByName(defnName) {
                return this.defnsByNameByTypeName.get(GameFramework.Action.name).get(defnName);
            }
            activityDefnByName(defnName) {
                return this.defnsByNameByTypeName.get(GameFramework.ActivityDefn.name).get(defnName);
            }
            entityDefnByName(defnName) {
                return this.defnsByNameByTypeName.get(GameFramework.Entity.name).get(defnName);
            }
            itemDefnByName(defnName) {
                return this.defnsByNameByTypeName.get(GameFramework.ItemDefn.name).get(defnName);
            }
            placeDefnByName(defnName) {
                return this.defnsByNameByTypeName.get(GameFramework.PlaceDefn.name).get(defnName);
            }
        }
        GameFramework.WorldDefn = WorldDefn;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
