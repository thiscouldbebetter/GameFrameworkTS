"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Ephemeral {
            constructor(ticksToLive, expire) {
                this.ticksToLive = ticksToLive;
                this.expire = expire;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) {
                this.ticksToLive--;
                if (this.ticksToLive <= 0) {
                    var entityEphemeral = uwpe.entity;
                    uwpe.place.entityToRemoveAdd(entityEphemeral);
                    if (this.expire != null) {
                        this.expire(uwpe);
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
