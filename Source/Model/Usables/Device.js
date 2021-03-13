"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Device extends GameFramework.EntityProperty {
            constructor(name, ticksToCharge, initialize, update, use) {
                super();
                this.name = name;
                this.ticksToCharge = ticksToCharge;
                this._initialize = initialize;
                this.update = update;
                this.use = use;
                this.tickLastUsed = 0 - this.ticksToCharge;
            }
            initialize(u, w, p, e) {
                if (this._initialize != null) {
                    this._initialize(u, w, p, e);
                }
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
                return new Device(this.name, this.ticksToCharge, this._initialize, this.update, this.use);
            }
        }
        GameFramework.Device = Device;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
