"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Idleable extends GameFramework.EntityProperty {
            constructor(ticksUntilIdle, idle) {
                super();
                this.ticksUntilIdle = ticksUntilIdle;
                this._idle = idle;
                this.tickLastActionPerformed = 0;
            }
            idle(universe, world, place, entity) {
                if (this._idle != null) {
                    this._idle(universe, world, place, entity);
                }
            }
            isIdle(world) {
                return this.ticksSinceLastAction(world) >= this.ticksUntilIdle;
            }
            ticksSinceLastAction(world) {
                return world.timerTicksSoFar - this.tickLastActionPerformed;
            }
            updateForTimerTick(universe, world, place, entity) {
                var actor = entity.actor();
                var actorIsActing = actor.actions.length > 0;
                if (actorIsActing) {
                    this.tickLastActionPerformed = world.timerTicksSoFar;
                }
                else if (this.isIdle(world)) {
                    this.idle(universe, world, place, entity);
                }
            }
        }
        GameFramework.Idleable = Idleable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
