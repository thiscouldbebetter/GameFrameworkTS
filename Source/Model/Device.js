"use strict";
class Device {
    constructor(name, ticksToCharge, initialize, update, use) {
        this.name = name;
        this.ticksToCharge = ticksToCharge;
        this.initialize = initialize;
        this.update = update;
        this.use = use;
        this.tickLastUsed = 0 - this.ticksToCharge;
    }
    use(u, w, p, eUser, eDevice) {
        var tickCurrent = w.timerTicksSoFar;
        var ticksSinceUsed = tickCurrent - this.tickLastUsed;
        if (ticksSinceUsed >= this.ticksToCharge) {
            this.tickLastUsed = tickCurrent;
            this._use(u, w, p, eUser, eDevice);
        }
    }
    // clonable
    clone() {
        return new Device(this.name, this.ticksToCharge, this.initialize, this.update, this.use);
    }
    ;
}
