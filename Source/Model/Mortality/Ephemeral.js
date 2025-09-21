"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Ephemeral extends GameFramework.EntityPropertyBase {
            constructor(ticksToLive, expire) {
                super();
                this.ticksToLive = ticksToLive || 100;
                this._expire = expire;
                this.ticksSoFar = 0;
            }
            static default() {
                return Ephemeral.fromTicksToLive(100);
            }
            static fromTicksAndExpire(ticksToLive, expire) {
                return new Ephemeral(ticksToLive, expire);
            }
            static fromTicksToLive(ticksToLive) {
                return new Ephemeral(ticksToLive, null);
            }
            static fromTicksToLiveAndExpire(ticksToLive, expire) {
                return new Ephemeral(ticksToLive, expire);
            }
            static of(entity) {
                return entity.propertyByName(Ephemeral.name);
            }
            expire(uwpe) {
                if (this._expire != null) {
                    this._expire(uwpe);
                }
            }
            isExpired() {
                return (this.ticksSoFar >= this.ticksToLive);
            }
            reset() {
                this.ticksSoFar = 0;
                return this;
            }
            toEntity() { return new GameFramework.Entity(Ephemeral.name, [this]); }
            // EntityProperty.
            updateForTimerTick(uwpe) {
                if (this.activated()) {
                    this.ticksSoFar++;
                    var isExpired = this.isExpired();
                    if (isExpired) {
                        var entityEphemeral = uwpe.entity;
                        uwpe.place.entityToRemoveAdd(entityEphemeral);
                        this.expire(uwpe);
                    }
                }
            }
            // Clonable.
            clone() {
                return new Ephemeral(this.ticksToLive, this.expire);
            }
        }
        GameFramework.Ephemeral = Ephemeral;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
