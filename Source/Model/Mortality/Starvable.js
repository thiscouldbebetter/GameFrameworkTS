"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Starvable {
            constructor(satietyMax, satietyLostPerTick, starve) {
                this.satietyMax = satietyMax;
                this.satietyLostPerTick = satietyLostPerTick;
                this._starve = starve;
                this.satiety = this.satietyMax;
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
            updateForTimerTick(uwpe) {
                if (this.isStarving()) {
                    this.starve(uwpe);
                }
                else {
                    this.satiety -= this.satietyLostPerTick;
                }
            }
            // cloneable
            clone() {
                return new Starvable(this.satietyMax, this.satietyLostPerTick, this._starve);
            }
        }
        GameFramework.Starvable = Starvable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
