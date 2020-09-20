"use strict";
class Phased extends EntityProperty {
    constructor(tickBorn, phases) {
        super();
        this.tickBorn = tickBorn;
        this.phases = phases;
    }
    phaseCurrent(world) {
        var returnValue = null;
        var ticksSinceBorn = world.timerTicksSoFar - this.tickBorn;
        for (var i = this.phases.length - 1; i >= 0; i--) {
            var phase = this.phases[i];
            var tickToRunAt = phase.tickToRunAt;
            if (ticksSinceBorn >= tickToRunAt) {
                returnValue = phase;
                break;
            }
        }
        return returnValue;
    }
    // EntityProperty.
    updateForTimerTick(u, w, p, e) {
        var ticksSinceBorn = w.timerTicksSoFar - this.tickBorn;
        for (var i = 0; i < this.phases.length; i++) {
            var phase = this.phases[i];
            var tickToRunAt = phase.tickToRunAt;
            if (ticksSinceBorn == tickToRunAt) {
                var updateToRun = phase.updateToRun;
                updateToRun(u, w, p, e);
            }
        }
    }
    // Clonable.
    clone() {
        return new Phased(this.tickBorn, ArrayHelper.clone(this.phases));
    }
    overwriteWith(other) {
        ArrayHelper.overwriteWith(this.phases, other.phases);
        this.tickBorn = other.tickBorn;
        return this;
    }
}
class Phase {
    constructor(name, tickToRunAt, updateToRun) {
        this.name = name;
        this.tickToRunAt = tickToRunAt;
        this.updateToRun = updateToRun;
    }
    clone() {
        return this;
    }
    overwriteWith(other) {
        return this;
    }
}
