"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Idleable extends GameFramework.EntityPropertyBase {
            constructor(ticksUntilIdle, idle) {
                super();
                this.ticksUntilIdle = ticksUntilIdle;
                this._idle = idle;
                this.tickLastActionPerformed = 0;
            }
            idle(uwpe) {
                if (this._idle != null) {
                    this._idle(uwpe);
                }
            }
            isIdle(world) {
                return this.ticksSinceLastAction(world) >= this.ticksUntilIdle;
            }
            ticksSinceLastAction(world) {
                return world.timerTicksSoFar - this.tickLastActionPerformed;
            }
            // Clonable.
            clone() {
                return this;
            }
            // EntityProperty.
            updateForTimerTick(uwpe) {
                var world = uwpe.world;
                var entity = uwpe.entity;
                var actor = GameFramework.Actor.of(entity);
                var actorIsActing = actor.actions.length > 0;
                if (actorIsActing) {
                    this.tickLastActionPerformed = world.timerTicksSoFar;
                }
                else if (this.isIdle(world)) {
                    this.idle(uwpe);
                }
            }
        }
        GameFramework.Idleable = Idleable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
