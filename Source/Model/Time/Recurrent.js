"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Recurrent extends GameFramework.EntityPropertyBase {
            constructor(ticksPerRecurrence, timesToRecur, recur) {
                super();
                this.ticksPerRecurrence = ticksPerRecurrence;
                this.timesToRecur = timesToRecur;
                this.recur = recur;
                this.timesRecurredSoFar = 0;
                this.ticksUntilRecurrence = this.ticksPerRecurrence;
            }
            static of(entity) {
                return entity.propertyByName(Recurrent.name);
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Recurrent.name; }
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
            overwriteWith(other) { return this; }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Recurrent = Recurrent;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
