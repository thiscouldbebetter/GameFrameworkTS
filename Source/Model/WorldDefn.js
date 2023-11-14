"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class WorldDefn {
            constructor(defnArrays) {
                for (var i = 0; i < defnArrays.length; i++) {
                    var defns = defnArrays[i];
                    if (defns.length > 0) {
                        var defn0 = defns[0];
                        var defnTypeName = defn0.constructor.name;
                        var notDefined = "undefined";
                        if (typeof (GameFramework.Action) != notDefined
                            && defnTypeName == GameFramework.Action.name) {
                            this.actions = defns;
                            this.actionsByName =
                                GameFramework.ArrayHelper.addLookupsByName(this.actions);
                        }
                        else if (typeof (GameFramework.ActivityDefn) != notDefined
                            && defnTypeName == GameFramework.ActivityDefn.name) {
                            this.activityDefns = defns;
                            this.activityDefnsByName =
                                GameFramework.ArrayHelper.addLookupsByName(this.activityDefns);
                        }
                        else if (typeof (GameFramework.Entity) != notDefined
                            && defnTypeName == GameFramework.Entity.name) {
                            this.entityDefnsInitialize(defns);
                        }
                        else if (typeof (GameFramework.ItemDefn) != notDefined
                            && defnTypeName == GameFramework.ItemDefn.name) {
                            this.itemDefnsInitialize(defns);
                        }
                        else if (typeof (GameFramework.PlaceDefn) != notDefined
                            && defnTypeName == GameFramework.PlaceDefn.name) {
                            this.placeDefns = defns;
                            this.placeDefnsByName =
                                GameFramework.ArrayHelper.addLookupsByName(this.placeDefns);
                        }
                        else if (typeof (GameFramework.Skill) != notDefined
                            && defnTypeName == GameFramework.Skill.name) {
                            this.skills = defns;
                            this.skillsByName =
                                GameFramework.ArrayHelper.addLookupsByName(this.skills);
                        }
                        else {
                            throw new Error("Unrecognized defn type: " + defnTypeName);
                        }
                    }
                }
            }
            static default() {
                return new WorldDefn([]);
            }
            static from6 // ActionActivityEntityItemyPlaceAndSkillDefns
            (actions, activityDefns, entityDefns, itemDefns, placeDefns, skills) {
                return new WorldDefn([
                    actions,
                    activityDefns,
                    entityDefns,
                    itemDefns,
                    placeDefns,
                    skills
                ]);
            }
            static fromPlaceDefns(placeDefns) {
                return new WorldDefn([placeDefns]);
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
            entityDefnsInitialize(defns) {
                defns = defns || [];
                this.entityDefns = defns;
                this.entityDefnsByName =
                    GameFramework.ArrayHelper.addLookupsByName(this.entityDefns);
            }
            itemDefnByName(defnName) {
                var returnValue = this.itemDefnsByName.get(defnName);
                return returnValue;
            }
            itemDefnsInitialize(defns) {
                defns = defns || [];
                this.itemDefns = defns;
                this.itemDefnsByName =
                    GameFramework.ArrayHelper.addLookupsByName(this.itemDefns);
            }
            placeDefnByName(defnName) {
                var returnValue = this.placeDefnsByName == null
                    ? null
                    : this.placeDefnsByName.get(defnName);
                return returnValue;
            }
        }
        GameFramework.WorldDefn = WorldDefn;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
