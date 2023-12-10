"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Device {
            constructor(name, ticksToCharge, initialize, update, use) {
                this.name = name;
                this.ticksToCharge = ticksToCharge;
                this._initialize = initialize;
                this.update = update;
                this.use = use;
                this.tickLastUsed = 0 - this.ticksToCharge;
            }
            // EntityProperty.
            finalize(uwpe) { }
            updateForTimerTick(uwpe) { }
            initialize(uwpe) {
                if (this._initialize != null) {
                    this._initialize(uwpe);
                }
            }
            use(uwpe) {
                var world = uwpe.world;
                var tickCurrent = world.timerTicksSoFar;
                var ticksSinceUsed = tickCurrent - this.tickLastUsed;
                if (ticksSinceUsed >= this.ticksToCharge) {
                    this.tickLastUsed = tickCurrent;
                    this._use(uwpe);
                }
            }
            // clonable
            clone() {
                return new Device(this.name, this.ticksToCharge, this._initialize, this.update, this.use);
            }
            overwriteWith(other) { throw new Error("Not yet implemented."); }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Device = Device;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
