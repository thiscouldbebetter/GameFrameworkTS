"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Animatable extends GameFramework.EntityProperty {
            constructor(animationDefnGroup, transformableAtRest, transformableTransformed) {
                super();
                this.animationDefnGroup = animationDefnGroup;
                this.transformableAtRest = transformableAtRest;
                this.transformableTransformed = transformableTransformed;
                this.ticksStartedByAnimationName = new Map();
            }
            animationStartByName(name, world) {
                if (this.ticksStartedByAnimationName.has(name) == false) {
                    this.ticksStartedByAnimationName.set(name, world.timerTicksSoFar);
                }
            }
            animationStopByName(name) {
                this.ticksStartedByAnimationName.delete(name);
            }
            animationWithNameStartIfNecessary(animationName, world) {
                if (this.ticksStartedByAnimationName.has(animationName) == false) {
                    this.ticksStartedByAnimationName.set(animationName, world.timerTicksSoFar);
                }
                return this.ticksStartedByAnimationName.get(animationName);
            }
            animationDefnsRunning() {
                var animationsRunningNames = this.animationsRunningNames();
                var returnValues = animationsRunningNames.map(x => this.animationDefnGroup.animationDefnsByName.get(x));
                return returnValues;
            }
            animationsRunningNames() {
                var animationsRunningNames = Array.from(this.ticksStartedByAnimationName.keys()).filter(x => this.ticksStartedByAnimationName.has(x));
                return animationsRunningNames;
            }
            animationsStopAll() {
                this.ticksStartedByAnimationName.clear();
            }
            transformableReset() {
                this.transformableTransformed.overwriteWith(this.transformableAtRest);
            }
            updateForTimerTick(universe, world, place, entity) {
                var animationDefnsRunning = this.animationDefnsRunning();
                for (var i = 0; i < animationDefnsRunning.length; i++) {
                    var animationDefn = animationDefnsRunning[i];
                    var tickAnimationStarted = this.ticksStartedByAnimationName.get(animationDefn.name);
                    var ticksSinceAnimationStarted = world.timerTicksSoFar - tickAnimationStarted;
                    var transform = new GameFramework.Transform_Animate(animationDefn, ticksSinceAnimationStarted);
                    this.transformableTransformed.overwriteWith(this.transformableAtRest);
                    transform.transform(this.transformableTransformed);
                }
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Animatable = Animatable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
