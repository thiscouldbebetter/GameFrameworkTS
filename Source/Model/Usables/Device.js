"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Device extends GameFramework.EntityPropertyBase {
            constructor(name, initialize, update, canUse, use) {
                super();
                this.name = name;
                this._initialize = initialize;
                this._update = update;
                this._canUse = canUse;
                this._use = use;
                this.tickLastUsed = 0 - this.ticksToCharge;
            }
            static fromEntity(entity) {
                return entity.propertyByName(Device.name);
            }
            static fromNameCanUseAndUse(name, canUse, use) {
                return new Device(name, null, null, canUse, use);
            }
            static fromNameTicksToChargeAndUse(name, ticksToCharge, use) {
                return Device.fromNameCanUseAndUse(name, (uwpe) => Device.canUseAfterTicksToCharge(uwpe, ticksToCharge), use);
            }
            static of(entity) {
                return entity.propertyByName(Device.name);
            }
            canUse(uwpe) {
                return this._canUse == null ? true : this._canUse(uwpe);
            }
            static canUseAfterTicksToCharge(uwpe, ticksToCharge) {
                var entityDevice = uwpe.entity2;
                var device = Device.fromEntity(entityDevice);
                var world = uwpe.world;
                var tickCurrent = world.timerTicksSoFar;
                var ticksSinceUsed = tickCurrent - device.tickLastUsed;
                var haveEnoughTicksPassedToCharge = (ticksSinceUsed >= ticksToCharge);
                return haveEnoughTicksPassedToCharge;
            }
            update(uwpe) {
                if (this._update != null) {
                    this._update(uwpe);
                }
            }
            use(uwpe) {
                var canUse = this.canUse(uwpe);
                if (canUse) {
                    var world = uwpe.world;
                    var tickCurrent = world.timerTicksSoFar;
                    this.tickLastUsed = tickCurrent;
                    this._use(uwpe);
                }
            }
            // EntityProperty.
            initialize(uwpe) {
                if (this._initialize != null) {
                    this._initialize(uwpe);
                }
            }
            // clonable
            clone() {
                return new Device(this.name, this._initialize, this._update, this._canUse, this._use);
            }
        }
        GameFramework.Device = Device;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
