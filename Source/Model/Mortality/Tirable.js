"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Tirable extends GameFramework.EntityPropertyBase {
            constructor(staminaMaxAfterSleep, staminaRecoveredPerTick, staminaMaxLostPerTick, staminaMaxRecoveredPerTickOfSleep, fallAsleep) {
                super();
                this.staminaMaxAfterSleep = staminaMaxAfterSleep;
                this.staminaRecoveredPerTick = staminaRecoveredPerTick;
                this.staminaMaxLostPerTick = staminaMaxLostPerTick;
                this.staminaMaxRecoveredPerTickOfSleep = staminaMaxRecoveredPerTickOfSleep;
                this._fallAsleep = fallAsleep;
                this.stamina = this.staminaMaxAfterSleep;
                this.staminaMaxRemainingBeforeSleep = this.staminaMaxAfterSleep;
            }
            static fromStaminaMaxRecoveredLostRecoveredAndFallAsleep(staminaMaxAfterSleep, staminaRecoveredPerTick, staminaMaxLostPerTick, staminaMaxRecoveredPerTickOfSleep, fallAsleep) {
                return new Tirable(staminaMaxAfterSleep, staminaRecoveredPerTick, staminaMaxLostPerTick, staminaMaxRecoveredPerTickOfSleep, fallAsleep);
            }
            static default() {
                return new Tirable(1, // staminaMaxAfterSleep
                0, // staminaRecoveredPerTick
                0, // staminaMaxLostPerTick
                1, // staminaMaxRecoveredPerTickOfSleep
                (uwpe) => { } // fallAsleep
                );
            }
            static of(entity) {
                return entity.propertyByName(Tirable.name);
            }
            fallAsleep(uwpe) {
                var staminaMaxToRecover = this.staminaMaxAfterSleep - this.staminaMaxRemainingBeforeSleep;
                var ticksToRecover = Math.ceil(staminaMaxToRecover / this.staminaMaxRecoveredPerTickOfSleep);
                var world = uwpe.world;
                world.timerTicksSoFar += ticksToRecover;
                if (this._fallAsleep != null) {
                    this._fallAsleep(uwpe);
                }
            }
            isExhausted() {
                return (this.staminaMaxRemainingBeforeSleep <= 0);
            }
            staminaAdd(amountToAdd) {
                this.stamina += amountToAdd;
                this.stamina = GameFramework.NumberHelper.trimToRangeMax(this.stamina, this.staminaMaxRemainingBeforeSleep);
            }
            staminaSubtract(amountToSubtract) {
                this.staminaAdd(0 - amountToSubtract);
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Tirable.name; }
            updateForTimerTick(uwpe) {
                if (this.isExhausted()) {
                    this.fallAsleep(uwpe);
                }
                else {
                    this.staminaMaxRemainingBeforeSleep -= this.staminaMaxLostPerTick;
                    this.staminaAdd(this.staminaRecoveredPerTick);
                }
            }
            // cloneable
            clone() {
                return new Tirable(this.staminaMaxAfterSleep, this.staminaRecoveredPerTick, this.staminaMaxLostPerTick, this.staminaMaxRecoveredPerTickOfSleep, this._fallAsleep);
            }
            overwriteWith(other) { return this; }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Tirable = Tirable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
