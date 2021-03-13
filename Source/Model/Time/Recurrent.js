"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Recurrent extends GameFramework.EntityProperty {
            constructor(ticksPerRecurrence, timesToRecur, recur) {
                super();
                this.ticksPerRecurrence = ticksPerRecurrence;
                this.timesToRecur = timesToRecur;
                this.recur = recur;
                this.timesRecurredSoFar = 0;
                this.ticksUntilRecurrence = this.ticksPerRecurrence;
            }
            updateForTimerTick(universe, world, place, entity) {
                if (this.timesRecurredSoFar < this.timesToRecur) {
                    this.ticksUntilRecurrence--;
                    if (this.ticksUntilRecurrence <= 0) {
                        this.ticksUntilRecurrence = this.ticksPerRecurrence;
                        this.timesRecurredSoFar++;
                        this.recur(universe, world, place, entity);
                    }
                }
            }
            // cloneable
            clone() {
                return new Recurrent(this.ticksPerRecurrence, this.timesToRecur, this.recur);
            }
        }
        GameFramework.Recurrent = Recurrent;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
