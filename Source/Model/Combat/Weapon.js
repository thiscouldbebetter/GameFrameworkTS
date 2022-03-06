"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Weapon {
            constructor(ticksToRecharge, entityProjectile) {
                this.ticksToRecharge = ticksToRecharge;
                this.entityProjectile = entityProjectile;
                var speedMax = this.entityProjectile.movable().speedMax(null);
                var ticksToLive = this.entityProjectile.ephemeral().ticksToLive;
                this.range = speedMax * ticksToLive;
                this.tickLastFired = 0 - this.ticksToRecharge;
            }
        }
        GameFramework.Weapon = Weapon;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
