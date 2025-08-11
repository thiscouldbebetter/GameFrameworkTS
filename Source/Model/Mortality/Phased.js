"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Phased extends GameFramework.EntityPropertyBase {
            constructor(phaseCurrentIndex, ticksOnPhaseCurrent, phases) {
                super();
                this.phaseCurrentIndex = phaseCurrentIndex || 0;
                this.ticksOnPhaseCurrent = ticksOnPhaseCurrent || 0;
                this.phases = phases;
                for (var i = 0; i < this.phases.length; i++) {
                    var phase = this.phases[i];
                    phase.index = i;
                }
            }
            static fromPhaseStartNameAndPhases(phaseStartName, phases) {
                var returnValue = new Phased(0, 0, phases);
                returnValue.phaseCurrentSetByName(phaseStartName);
                return returnValue;
            }
            static fromPhases(phases) {
                return new Phased(0, 0, phases);
            }
            static of(entity) {
                return entity.propertyByName(Phased.name);
            }
            phaseByName(phaseName) {
                return this.phases.find(x => x.name == phaseName);
            }
            phaseCurrent() {
                return this.phases[this.phaseCurrentIndex];
            }
            phaseCurrentSetByName(phaseName) {
                var phase = this.phaseByName(phaseName);
                var phaseIndex = this.phases.indexOf(phase);
                this.phaseCurrentIndex = phaseIndex;
                return phase;
            }
            reset() {
                this.phaseCurrentIndex = 0;
                this.ticksOnPhaseCurrent = 0;
                return this;
            }
            // EntityProperty.
            initialize(uwpe) {
                for (var i = 0; i <= this.phaseCurrentIndex; i++) {
                    var phase = this.phases[i];
                    phase.enter(uwpe);
                }
            }
            updateForTimerTick(uwpe) {
                this.ticksOnPhaseCurrent++;
                var phaseCurrent = this.phaseCurrent();
                if (this.ticksOnPhaseCurrent >= phaseCurrent.durationInTicks) {
                    this.phaseCurrentIndex++;
                    this.ticksOnPhaseCurrent = 0;
                    phaseCurrent = this.phaseCurrent();
                    phaseCurrent.enter(uwpe);
                }
            }
            // Clonable.
            clone() {
                return new Phased(this.phaseCurrentIndex, this.ticksOnPhaseCurrent, GameFramework.ArrayHelper.clone(this.phases));
            }
            overwriteWith(other) {
                GameFramework.ArrayHelper.overwriteWith(this.phases, other.phases);
                this.phaseCurrentIndex = other.phaseCurrentIndex;
                this.ticksOnPhaseCurrent = other.ticksOnPhaseCurrent;
                return this;
            }
        }
        GameFramework.Phased = Phased;
        class Phase {
            constructor(index, name, durationInTicks, enter) {
                this.index = index;
                this.name = name;
                this.durationInTicks = durationInTicks;
                this._enter = enter;
            }
            static fromIndexNameTicksAndEnter(index, name, durationInTicks, enter) {
                return new Phase(index, name, durationInTicks, enter);
            }
            static fromNameTicksAndEnter(name, durationInTicks, enter) {
                return new Phase(null, name, durationInTicks, enter);
            }
            enter(uwpe) {
                if (this._enter != null) {
                    this._enter(uwpe);
                }
            }
            // Clonable.
            clone() {
                return new Phase(this.index, this.name, this.durationInTicks, this._enter);
            }
            overwriteWith(other) {
                this.index = other.index;
                this.name = other.name;
                this.durationInTicks = other.durationInTicks;
                this._enter = other.enter;
                return this;
            }
        }
        GameFramework.Phase = Phase;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
