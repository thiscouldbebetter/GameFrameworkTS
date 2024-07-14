"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Damager {
            constructor(damagePerHit, ticksPerAttempt, chanceOfHitPerAttempt) {
                this.damagePerHit = damagePerHit;
                this.ticksPerAttempt = ticksPerAttempt || 20;
                this.chanceOfHitPerAttempt = chanceOfHitPerAttempt || 1;
                this.ticksUntilCanAttempt = 0;
            }
            static default() {
                return Damager.fromDamagePerHit(GameFramework.Damage.default());
            }
            static fromDamagePerHit(damagePerHit) {
                return new Damager(damagePerHit, null, null);
            }
            damageToApply(universe) {
                var returnDamage = null;
                if (this.ticksUntilCanAttempt <= 0) {
                    this.ticksUntilCanAttempt = this.ticksPerAttempt;
                    var randomNumber = universe.randomizer.fraction();
                    var doesAttemptSucceed = (randomNumber < this.chanceOfHitPerAttempt);
                    if (doesAttemptSucceed) {
                        returnDamage = this.damagePerHit;
                    }
                }
                return returnDamage;
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Damager.name; }
            updateForTimerTick(uwpe) {
                this.ticksUntilCanAttempt--;
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Damager = Damager;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
