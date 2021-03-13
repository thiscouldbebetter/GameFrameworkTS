"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Ephemeral extends GameFramework.EntityProperty {
            constructor(ticksToLive, expire) {
                super();
                this.ticksToLive = ticksToLive;
                this.expire = expire;
            }
            updateForTimerTick(universe, world, place, entityEphemeral) {
                this.ticksToLive--;
                if (this.ticksToLive <= 0) {
                    place.entitiesToRemove.push(entityEphemeral);
                    if (this.expire != null) {
                        this.expire(universe, world, place, entityEphemeral);
                    }
                }
            }
            // cloneable
            clone() {
                return new Ephemeral(this.ticksToLive, this.expire);
            }
        }
        GameFramework.Ephemeral = Ephemeral;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
