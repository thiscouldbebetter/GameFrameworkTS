"use strict";
class Alive extends EntityProperty {
    constructor(tickBorn, ticksToRunAtAndUpdatesToRun) {
        super();
        this.tickBorn = tickBorn;
        this.ticksToRunAtAndUpdatesToRun = ticksToRunAtAndUpdatesToRun;
        this.haveUpdatesBeenRun =
            this.ticksToRunAtAndUpdatesToRun.map(x => false);
    }
    updateForTimerTick(u, w, p, e) {
        var ticksSinceBorn = w.timerTicksSoFar - this.tickBorn;
        for (var i = 0; i < this.ticksToRunAtAndUpdatesToRun.length; i++) {
            var tickToRunAtAndUpdateToRun = this.ticksToRunAtAndUpdatesToRun[i];
            var tickToRunAt = tickToRunAtAndUpdateToRun[0];
            if (ticksSinceBorn < tickToRunAt) {
                break;
            }
            else {
                var hasUpdateBeenRun = this.haveUpdatesBeenRun[i];
                if (hasUpdateBeenRun == false) {
                    var updateToRun = tickToRunAtAndUpdateToRun[1];
                    updateToRun(u, w, p, e);
                    this.haveUpdatesBeenRun[i] = true;
                }
            }
        }
    }
    // Clonable.
    clone() {
        return new Alive(this.tickBorn, this.ticksToRunAtAndUpdatesToRun);
    }
    overwriteWith(other) {
        this.tickBorn = other.tickBorn;
        return this;
    }
}
