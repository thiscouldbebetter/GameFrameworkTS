"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class StatsKeeper {
            constructor() {
                // Common stats.
                this.StatNameScore = "Score";
                this.StatNameHits = "Hits";
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
            statWithNameAddValue(name, valueToAdd) {
                this._statValuesByName.set(name, this.statValueByName(name) + valueToAdd);
            }
            statWithNameIncrement(name) {
                this._statValuesByName.set(name, this.statValueByName(name) + 1);
            }
            statsClear() {
                this._statValuesByName.clear();
                return this;
            }
            hits() {
                return this.statValueByName(this.StatNameHits);
            }
            hitsClear() {
                this._statValuesByName.set(this.StatNameHits, 0);
                return this;
            }
            hitsIncrement() {
                this.statWithNameIncrement(this.StatNameHits);
            }
            score() {
                return this.statValueByName(this.StatNameScore);
            }
            scoreAdd(valueToAdd) {
                this.statWithNameAddValue(this.StatNameScore, valueToAdd);
            }
            shots() {
                return this.statValueByName(this.StatNameShots);
            }
            shotsClear() {
                this._statValuesByName.set(this.StatNameShots, 0);
                return this;
            }
            shotsIncrement() {
                this.statWithNameIncrement(this.StatNameShots);
            }
            kills() {
                return this.statValueByName(this.StatNameKills);
            }
            killsClear() {
                this._statValuesByName.set(this.StatNameKills, 0);
                return this;
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
