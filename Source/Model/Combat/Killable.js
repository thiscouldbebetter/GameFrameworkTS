"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Killable extends GameFramework.EntityPropertyBase {
            constructor(ticksOfImmunityInitial, integrityMax, damageApply, die, livesInReserve) {
                super();
                this.ticksOfImmunityInitial = ticksOfImmunityInitial || 0;
                this.integrityMax = integrityMax || 1;
                this._damageApply = damageApply;
                this._die = die;
                this.livesInReserve = livesInReserve || 0;
                this.ticksOfImmunityRemaining = this.ticksOfImmunityInitial;
                this.deathIsIgnored = false;
                this.integritySetToMax();
            }
            static fromDie(die) {
                return new Killable(null, null, null, die, null);
            }
            static default() {
                return Killable.fromIntegrityMax(1);
            }
            static fromIntegrityMax(integrityMax) {
                return new Killable(null, integrityMax, null, null, null);
            }
            static fromIntegrityMaxAndDie(integrityMax, die) {
                return new Killable(null, integrityMax, null, die, null);
            }
            static fromIntegrityMaxDamageApplyAndDie(integrityMax, damageApply, die) {
                return new Killable(null, integrityMax, damageApply, die, null);
            }
            static fromTicksOfImmunity(ticksOfImmunityInitial) {
                return new Killable(ticksOfImmunityInitial, null, null, null, null);
            }
            static fromTicksOfImmunityAndDie(ticksOfImmunityInitial, die) {
                return new Killable(ticksOfImmunityInitial, null, null, die, null);
            }
            static fromTicksOfImmunityDieAndLives(ticksOfImmunityInitial, die, livesInReserve) {
                return new Killable(ticksOfImmunityInitial, null, null, die, livesInReserve);
            }
            static fromTicksOfImmunityIntegrityMaxAndDie(ticksOfImmunityInitial, integrityMax, die) {
                return new Killable(ticksOfImmunityInitial, integrityMax, null, die, null);
            }
            static fromTicksOfImmunityIntegrityMaxDamageApplyDieAndLives(ticksOfImmunityInitial, integrityMax, damageApply, die, livesInReserve) {
                return new Killable(ticksOfImmunityInitial, integrityMax, damageApply, die, livesInReserve);
            }
            static of(entity) {
                return entity.propertyByName(Killable.name);
            }
            damageApply(uwpe, damageToApply) {
                if (damageToApply == null) {
                    // Do nothing.
                }
                else if (this.immunityIsInEffect()) {
                    // Do nothing.
                }
                else if (this._damageApply == null) {
                    this.damageApply_Default(uwpe, damageToApply);
                }
                else {
                    this._damageApply(uwpe, damageToApply);
                }
            }
            damageApply_Default(uwpe, damageToApply) {
                var universe = uwpe.universe;
                var entityDamager = uwpe.entity;
                var entityKillable = uwpe.entity2;
                var randomizer = universe.randomizer;
                var damageApplied = damageToApply == null
                    ? GameFramework.Damager.of(entityDamager).damagePerHit.amount(randomizer)
                    : damageToApply.amount(randomizer);
                var killable = Killable.of(entityKillable);
                killable.integritySubtract(damageApplied);
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
                integrityToSet = GameFramework.NumberHelper.trimToRangeMax(integrityToSet, this.integrityMax);
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
            immunityIsInEffect() {
                return (this.ticksOfImmunityRemaining > 0);
            }
            isAlive() {
                return (this.integrity > 0 || this.deathIsIgnored);
            }
            kill() {
                this.integritySet(0);
            }
            ticksOfImmunityInitialSet(value) {
                this.ticksOfImmunityInitial = value;
                return this;
            }
            ticksOfImmunityRemainingReset() {
                this.ticksOfImmunityRemaining = this.ticksOfImmunityInitial;
            }
            // EntityProperty.
            initialize(uwpe) {
                this.ticksOfImmunityRemainingReset();
            }
            updateForTimerTick(uwpe) {
                var immunityIsInEffect = this.immunityIsInEffect();
                if (immunityIsInEffect) {
                    this.ticksOfImmunityRemaining--;
                }
                else {
                    var killableIsAlive = this.isAlive();
                    if (killableIsAlive == false) {
                        var place = uwpe.place;
                        var entityKillable = uwpe.entity;
                        place.entityToRemoveAdd(entityKillable);
                        this.die(uwpe);
                    }
                }
            }
            // Clonable.
            clone() {
                return new Killable(this.ticksOfImmunityInitial, this.integrityMax, this._damageApply, this._die, this.livesInReserve);
            }
            overwriteWith(other) {
                this.ticksOfImmunityInitial = other.ticksOfImmunityInitial;
                this.integrityMax = other.integrityMax;
                this._damageApply = other._damageApply;
                this._die = other._die;
                this.livesInReserve = other.livesInReserve;
                this.integrity = other.integrity;
                this.ticksOfImmunityRemaining = other.ticksOfImmunityRemaining;
                return this;
            }
        }
        GameFramework.Killable = Killable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
