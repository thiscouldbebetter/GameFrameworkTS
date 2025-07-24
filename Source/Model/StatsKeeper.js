"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class StatsKeeper {
            constructor() {
                // Common stats.
                this.StatNameKills = "Kills";
                this.StatNameShots = "Shots";
                this._statValuesByName = new Map();
            }
            static create() {
                return new StatsKeeper();
            }
            static of(entity) {
                return entity.propertyByName(StatsKeeper.name);
            }
            statValueByName(name) {
                if (this._statValuesByName.has(name) == false) {
                    this._statValuesByName.set(name, 0);
                }
                return this._statValuesByName.get(name);
            }
            statWithNameIncrement(name) {
                this._statValuesByName.set(name, this.statValueByName(name) + 1);
            }
            statsClear() {
                this._statValuesByName.clear();
                return this;
            }
            shots() {
                return this.statValueByName(this.StatNameShots);
            }
            shotsIncrement() {
                this.statWithNameIncrement(this.StatNameShots);
            }
            kills() {
                return this.statValueByName(this.StatNameKills);
            }
            killsIncrement() {
                this.statWithNameIncrement(this.StatNameKills);
            }
            // Clonable.
            clone() {
                throw new Error("todo");
            }
            overwriteWith(other) {
                throw new Error("todo");
            }
            // Equatable
            equals(other) { return false; } // todo
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return StatsKeeper.name; }
            updateForTimerTick(uwpe) { }
        }
        GameFramework.StatsKeeper = StatsKeeper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
