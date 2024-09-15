"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Killable {
            constructor(integrityMax, damageApply, die) {
                this.integrityMax = integrityMax;
                this._damageApply = damageApply;
                this._die = die;
                this.deathIsIgnored = false;
                this.integritySetToMax();
            }
            static default() {
                return Killable.fromIntegrityMax(1);
            }
            static fromIntegrityMax(integrityMax) {
                return new Killable(integrityMax, null, null);
            }
            static fromIntegrityMaxAndDie(integrityMax, die) {
                return new Killable(integrityMax, null, die);
            }
            damageApply(uwpe, damageToApply) {
                if (damageToApply == null) {
                    return 0;
                }
                var universe = uwpe.universe;
                var entityDamager = uwpe.entity;
                var entityKillable = uwpe.entity2;
                var damageApplied;
                if (this._damageApply == null) {
                    var randomizer = universe.randomizer;
                    damageApplied =
                        (damageToApply == null
                            ? entityDamager.damager().damagePerHit.amount(randomizer)
                            : damageToApply.amount(randomizer));
                    var killable = entityKillable.killable();
                    killable.integritySubtract(damageApplied);
                }
                else {
                    damageApplied = this._damageApply(uwpe, damageToApply);
                }
                return damageApplied;
            }
            deathIsIgnoredSet(value) {
                this.deathIsIgnored = value;
                return this;
            }
            die(uwpe) {
                if (this._die != null) {
                    this._die(uwpe);
                }
            }
            integrityAdd(amountToAdd) {
                var integrityToSet = this.integrity + amountToAdd;
                integrityToSet = GameFramework.NumberHelper.trimToRangeMax(this.integrity, this.integrityMax);
                this.integritySet(integrityToSet);
            }
            integrityCurrentOverMax() {
                return this.integrity + "/" + this.integrityMax;
            }
            integritySet(value) {
                this.integrity = value;
                return this;
            }
            integritySetToMax() {
                this.integritySet(this.integrityMax);
            }
            integritySubtract(amountToSubtract) {
                this.integrityAdd(0 - amountToSubtract);
            }
            kill() {
                this.integritySet(0);
            }
            isAlive() {
                return (this.integrity > 0 || this.deathIsIgnored);
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Killable.name; }
            updateForTimerTick(uwpe) {
                var killableIsAlive = this.isAlive();
                if (killableIsAlive == false) {
                    var place = uwpe.place;
                    var entityKillable = uwpe.entity;
                    place.entityToRemoveAdd(entityKillable);
                    this.die(uwpe);
                }
            }
            // Clonable.
            clone() {
                return new Killable(this.integrityMax, this._damageApply, this._die);
            }
            overwriteWith(other) { return this; }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Killable = Killable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
