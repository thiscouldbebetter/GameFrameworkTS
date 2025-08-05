"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Damager extends GameFramework.EntityPropertyBase {
            constructor(damagePerHit, ticksPerAttempt, chanceOfHitPerAttempt) {
                super();
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
            static of(entity) {
                return entity.propertyByName(Damager.name);
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
            // EntityProperty.
            updateForTimerTick(uwpe) {
                this.ticksUntilCanAttempt--;
            }
        }
        GameFramework.Damager = Damager;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
