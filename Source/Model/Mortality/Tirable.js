"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Tirable extends GameFramework.EntityProperty {
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
            fallAsleep(u, w, p, e) {
                var staminaMaxToRecover = this.staminaMaxAfterSleep - this.staminaMaxRemainingBeforeSleep;
                var ticksToRecover = Math.ceil(staminaMaxToRecover / this.staminaMaxRecoveredPerTickOfSleep);
                w.timerTicksSoFar += ticksToRecover;
                if (this._fallAsleep != null) {
                    this._fallAsleep(u, w, p, e);
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
            updateForTimerTick(universe, world, place, entityStarvable) {
                if (this.isExhausted()) {
                    this.fallAsleep(universe, world, place, entityStarvable);
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
        }
        GameFramework.Tirable = Tirable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
