"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Recurrent {
            constructor(ticksPerRecurrence, timesToRecur, recur) {
                this.ticksPerRecurrence = ticksPerRecurrence;
                this.timesToRecur = timesToRecur;
                this.recur = recur;
                this.timesRecurredSoFar = 0;
                this.ticksUntilRecurrence = this.ticksPerRecurrence;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) {
                if (this.timesRecurredSoFar < this.timesToRecur) {
                    this.ticksUntilRecurrence--;
                    if (this.ticksUntilRecurrence <= 0) {
                        this.ticksUntilRecurrence = this.ticksPerRecurrence;
                        this.timesRecurredSoFar++;
                        this.recur(uwpe);
                    }
                }
            }
            // cloneable
            clone() {
                return new Recurrent(this.ticksPerRecurrence, this.timesToRecur, this.recur);
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Recurrent = Recurrent;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
