"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Phased {
            constructor(tickBorn, phases) {
                this.tickBorn = tickBorn;
                this.phases = phases;
            }
            phaseCurrent(world) {
                var returnValue = null;
                var ticksSinceBorn = world.timerTicksSoFar - this.tickBorn;
                for (var i = this.phases.length - 1; i >= 0; i--) {
                    var phase = this.phases[i];
                    var tickToRunAt = phase.tickToRunAt;
                    if (ticksSinceBorn >= tickToRunAt) {
                        returnValue = phase;
                        break;
                    }
                }
                return returnValue;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) {
                var w = uwpe.world;
                var ticksSinceBorn = w.timerTicksSoFar - this.tickBorn;
                for (var i = 0; i < this.phases.length; i++) {
                    var phase = this.phases[i];
                    var tickToRunAt = phase.tickToRunAt;
                    if (ticksSinceBorn == tickToRunAt) {
                        var updateToRun = phase.updateToRun;
                        updateToRun(uwpe);
                    }
                }
            }
            // Clonable.
            clone() {
                return new Phased(this.tickBorn, GameFramework.ArrayHelper.clone(this.phases));
            }
            overwriteWith(other) {
                GameFramework.ArrayHelper.overwriteWith(this.phases, other.phases);
                this.tickBorn = other.tickBorn;
                return this;
            }
        }
        GameFramework.Phased = Phased;
        class Phase {
            constructor(name, tickToRunAt, updateToRun) {
                this.name = name;
                this.tickToRunAt = tickToRunAt;
                this.updateToRun = updateToRun;
            }
            clone() {
                return this;
            }
            overwriteWith(other) {
                return this;
            }
        }
        GameFramework.Phase = Phase;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
