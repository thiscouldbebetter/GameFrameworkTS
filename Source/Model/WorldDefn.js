"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class WorldDefn {
            constructor(defnArrays) {
                defnArrays = defnArrays || [];
                this.defnArraysByTypeName = new Map();
                this.defnsByNameByTypeName = new Map();
                for (var i = 0; i < defnArrays.length; i++) {
                    var defnsOfType = defnArrays[i];
                    var defnsByName = GameFramework.ArrayHelper.addLookupsByName(defnsOfType);
                    if (defnsOfType.length > 0) {
                        var itemFirst = defnsOfType[0];
                        var itemTypeName = itemFirst.constructor.name;
                        this.defnArraysByTypeName.set(itemTypeName, defnsOfType);
                        this.defnsByNameByTypeName.set(itemTypeName, defnsByName);
                    }
                }
            }
            static default() {
                return new WorldDefn(null);
            }
            // Convenience methods.
            actionByName(defnName) {
                var defnsByName = this.defnsByNameByTypeName.get(GameFramework.Action.name);
                var returnValue = defnsByName.get(defnName);
                return returnValue;
            }
            activityDefnByName(defnName) {
                var defnsByName = this.defnsByNameByTypeName.get(GameFramework.ActivityDefn.name);
                var returnValue = defnsByName.get(defnName);
                return returnValue;
            }
            entityDefnByName(defnName) {
                var defnsByName = this.defnsByNameByTypeName.get(GameFramework.Entity.name);
                var returnValue = defnsByName.get(defnName);
                return returnValue;
            }
            itemDefnByName(defnName) {
                var defnsByName = this.defnsByNameByTypeName.get(GameFramework.ItemDefn.name);
                var returnValue = defnsByName.get(defnName);
                return returnValue;
            }
            placeDefnByName(defnName) {
                var defnsByName = this.defnsByNameByTypeName.get(GameFramework.PlaceDefn.name);
                var returnValue = defnsByName.get(defnName);
                return returnValue;
            }
        }
        GameFramework.WorldDefn = WorldDefn;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
