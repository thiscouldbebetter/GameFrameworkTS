"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Activity {
            constructor(defnName, targetEntitiesByName) {
                this.defnName = defnName;
                this.targetEntitiesByName =
                    targetEntitiesByName || new Map([]);
                this.isDone = false;
            }
            static default() {
                return Activity.fromDefnName(GameFramework.ActivityDefn.Instances().DoNothing.name);
            }
            static fromDefnName(defnName) {
                return new Activity(defnName, null);
            }
            static fromDefnNameAndTargetEntity(defnName, target) {
                return new Activity(defnName, new Map([
                    [defnName, target]
                ]));
            }
            clear() {
                this.defnName = GameFramework.ActivityDefn.Instances().DoNothing.name;
                this.targetEntityClear();
                this.targetEntitiesByName.clear();
                return this;
            }
            defn(world) {
                return world.defn.activityDefnByName(this.defnName);
            }
            defnNameSet(defnName) {
                this.defnName = defnName;
                return this;
            }
            defnNameAndTargetEntitySet(defnName, targetEntity) {
                this.defnName = defnName;
                this.targetEntitySet(targetEntity);
                return this;
            }
            defnSet(defn) {
                this.defnName = defn.name;
                return this;
            }
            defnTarget(defnName, targetEntity) {
                // Tersely-named alias.
                return this.defnNameAndTargetEntitySet(defnName, targetEntity);
            }
            doNothing() {
                this.defnNameSet(GameFramework.ActivityDefn.Instances().DoNothing.name);
                this.targetEntitiesClearAll();
            }
            isDoNothing() {
                return (this.defnName == GameFramework.ActivityDefn.Instances().DoNothing.name);
            }
            isDoneSet(value) {
                this.isDone = value;
                return this;
            }
            perform(uwpe) {
                if (this.defnName != null) {
                    var defn = this.defn(uwpe.world);
                    defn.perform(uwpe);
                }
            }
            targetEntitiesClearAll() {
                this.targetEntitiesByName.clear();
                return this;
            }
            targetEntity() {
                return this.targetEntityByName(this.defnName);
            }
            targetEntityByName(targetEntityName) {
                return this.targetEntitiesByName.get(targetEntityName);
            }
            targetEntityClear() {
                this.targetEntityClearByName(this.defnName);
                return this;
            }
            targetEntityClearByName(name) {
                this.targetEntitiesByName.delete(name);
                return this;
            }
            targetEntitySet(value) {
                this.targetEntitySetByName(this.defnName, value);
                return this;
            }
            targetEntitySetByName(name, value) {
                this.targetEntitiesByName.set(name, value);
                return this;
            }
            // Clonable.
            clone() {
                return Activity.fromDefnName(this.defnName);
            }
            overwriteWith(other) {
                this.defnName = other.defnName;
                return this;
            }
        }
        GameFramework.Activity = Activity;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
