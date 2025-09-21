"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Killable extends GameFramework.EntityPropertyBase {
            constructor(ticksOfImmunityInitial, integrityMax, removeFromPlaceUponDeath, damageApply, die, livesInReserve) {
                super();
                this.ticksOfImmunityInitial = ticksOfImmunityInitial || 0;
                this.integrityMax = integrityMax || 1;
                this.removeFromPlaceUponDeath = removeFromPlaceUponDeath || true;
                this._damageApply = damageApply;
                this._die = die;
                this.livesInReserve = livesInReserve || 0;
                this.ticksOfImmunityRemaining = this.ticksOfImmunityInitial;
                this.deathIsIgnored = false;
                this.dieHasBeenRun = false;
                this.integritySetToMax();
            }
            static fromDie(die) {
                return new Killable(null, null, null, null, die, null);
            }
            static default() {
                return Killable.fromIntegrityMax(1);
            }
            static fromIntegrityMax(integrityMax) {
                return new Killable(null, integrityMax, null, null, null, null);
            }
            static fromIntegrityMaxAndDie(integrityMax, die) {
                return new Killable(null, integrityMax, null, null, die, null);
            }
            static fromIntegrityMaxDamageApplyAndDie(integrityMax, damageApply, die) {
                return new Killable(null, integrityMax, null, damageApply, die, null);
            }
            static fromTicksOfImmunity(ticksOfImmunityInitial) {
                return new Killable(ticksOfImmunityInitial, null, null, null, null, null);
            }
            static fromTicksOfImmunityAndDie(ticksOfImmunityInitial, die) {
                return new Killable(ticksOfImmunityInitial, null, null, null, die, null);
            }
            static fromTicksOfImmunityDieAndLives(ticksOfImmunityInitial, die, livesInReserve) {
                return new Killable(ticksOfImmunityInitial, null, null, null, die, livesInReserve);
            }
            static fromTicksOfImmunityIntegrityMaxAndDie(ticksOfImmunityInitial, integrityMax, die) {
                return new Killable(ticksOfImmunityInitial, integrityMax, null, null, die, null);
            }
            static fromTicksOfImmunityIntegrityMaxDamageApplyDieAndLives(ticksOfImmunityInitial, integrityMax, damageApply, die, livesInReserve) {
                return new Killable(ticksOfImmunityInitial, integrityMax, null, damageApply, die, livesInReserve);
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
                if (this.dieHasBeenRun == false) {
                    this.dieHasBeenRun = true;
                    var entity = uwpe.entity;
                    if (this.removeFromPlaceUponDeath) {
                        var place = uwpe.place;
                        place.entityToRemoveAdd(entity);
                    }
                    var entityActor = GameFramework.Actor.of(entity);
                    if (entityActor != null) {
                        entityActor.inactivate();
                    }
                    if (this._die != null) {
                        this._die(uwpe);
                    }
                }
            }
            static die_RemoveEntityKillableFromPlace(uwpe) {
                var place = uwpe.place;
                var entity = uwpe.entity;
                place.entityToRemoveAdd(entity);
            }
            integrityAdd(amountToAdd) {
                var integrityToSet = this.integrity + amountToAdd;
                integrityToSet = GameFramework.NumberHelper.trimToRangeMax(integrityToSet, this.integrityMax);
                this.integritySet(integrityToSet);
            }
            integrityCurrentOverMax() {
                return this.integrity + "/" + this.integrityMax;
            }
            integrityMaxSet(value) {
                this.integrityMax = value;
                return this;
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
                var isAlive = this.dieHasBeenRun == false
                    && (this.integrity > 0 || this.deathIsIgnored);
                return isAlive;
            }
            kill() {
                this.integritySet(0);
            }
            livesInReserveSet(value) {
                this.livesInReserve = value;
                return this;
            }
            removeFromPlaceUponDeathSet(value) {
                this.removeFromPlaceUponDeath = value;
                return this;
            }
            reset() {
                this.integritySetToMax();
                this.ticksOfImmunityRemainingReset();
                this.dieHasBeenRun = false;
                return this;
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
                        this.die(uwpe);
                    }
                }
            }
            // Clonable.
            clone() {
                return new Killable(this.ticksOfImmunityInitial, this.integrityMax, this.removeFromPlaceUponDeath, this._damageApply, this._die, this.livesInReserve);
            }
            overwriteWith(other) {
                this.ticksOfImmunityInitial = other.ticksOfImmunityInitial;
                this.integrityMax = other.integrityMax;
                this.removeFromPlaceUponDeath = other.removeFromPlaceUponDeath;
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
