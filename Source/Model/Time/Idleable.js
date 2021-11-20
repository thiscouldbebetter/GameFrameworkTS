"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Idleable {
            constructor(ticksUntilIdle, idle) {
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
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) {
                var world = uwpe.world;
                var entity = uwpe.entity;
                var actor = entity.actor();
                var actorIsActing = actor.actions.length > 0;
                if (actorIsActing) {
                    this.tickLastActionPerformed = world.timerTicksSoFar;
                }
                else if (this.isIdle(world)) {
                    this.idle(uwpe);
                }
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Idleable = Idleable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
