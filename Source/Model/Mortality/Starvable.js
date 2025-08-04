"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Starvable {
            constructor(satietyMax, satietyLostPerTick, starve) {
                this.satietyMax = satietyMax;
                this.satietyLostPerTick = satietyLostPerTick || 1;
                this._starve = starve;
                this.satiety = this.satietyMax;
            }
            static fromSatietyMax(satietyMax) {
                return new Starvable(satietyMax, null, null);
            }
            static fromSatietyMaxSatietyToLosePerTickAndStarve(satietyMax, satietyLostPerTick, starve) {
                return new Starvable(satietyMax, satietyLostPerTick, starve);
            }
            static of(entity) {
                return entity.propertyByName(Starvable.name);
            }
            starve(uwpe) {
                if (this._starve != null) {
                    this._starve(uwpe);
                }
            }
            satietyAdd(amountToAdd) {
                this.satiety += amountToAdd;
                this.satiety = GameFramework.NumberHelper.trimToRangeMax(this.satiety, this.satietyMax);
            }
            satietySubtract(amountToSubtract) {
                this.satietyAdd(0 - amountToSubtract);
            }
            isStarving() {
                return (this.satiety <= 0);
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Starvable.name; }
            updateForTimerTick(uwpe) {
                if (this.isStarving()) {
                    this.starve(uwpe);
                }
                else {
                    this.satiety -= this.satietyLostPerTick;
                    if (this.satiety < 0) {
                        this.satiety = 0;
                    }
                }
            }
            // cloneable
            clone() {
                return new Starvable(this.satietyMax, this.satietyLostPerTick, this._starve);
            }
            overwriteWith(other) { return this; }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Starvable = Starvable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
