"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Scorable extends GameFramework.EntityPropertyBase {
            constructor(scoreGet) {
                super();
                this._scoreGet = scoreGet;
            }
            static create() {
                return new Scorable(null);
            }
            static fromPoints(pointsToScore) {
                return Scorable.fromScoreGet((uwpe) => pointsToScore);
            }
            static fromScoreGet(scoreGet) {
                return new Scorable(scoreGet);
            }
            static of(entity) {
                return entity.propertyByName(Scorable.name);
            }
            scoreGet(uwpe) {
                var score = this._scoreGet == null
                    ? 0
                    : this._scoreGet(uwpe);
                return score;
            }
            // Clonable.
            clone() {
                return new Scorable(this._scoreGet);
            }
            overwriteWith(other) {
                this._scoreGet = other._scoreGet;
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Scorable.name; }
            updateForTimerTick(uwpe) { }
        }
        GameFramework.Scorable = Scorable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
