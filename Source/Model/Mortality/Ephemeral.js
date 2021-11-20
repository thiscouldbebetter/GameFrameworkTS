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
            toEntity() { return new GameFramework.Entity(Ephemeral.name, [this]); }
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
            // Clonable.
            clone() {
                return new Ephemeral(this.ticksToLive, this.expire);
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Ephemeral = Ephemeral;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
