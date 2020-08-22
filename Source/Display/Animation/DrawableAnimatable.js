"use strict";
class DrawableAnimatable {
    constructor() {
        this.ticksStartedByAnimationName = new Map();
    }
    animationStartByName(name, world) {
        this.ticksStartedByAnimationName.set(name, world.timerTicksSoFar);
    }
    animationStopByName(name) {
        this.ticksStartedByAnimationName.delete(name);
    }
    animationsRunningNames() {
        var animationsRunningNames = Array.from(this.ticksStartedByAnimationName.keys()).filter(x => this.ticksStartedByAnimationName.has(x));
        return animationsRunningNames;
    }
    animationWithNameStartIfNecessary(animationName, world) {
        if (this.ticksStartedByAnimationName.has(animationName) == false) {
            this.ticksStartedByAnimationName.set(animationName, world.timerTicksSoFar);
        }
        return this.ticksStartedByAnimationName.get(animationName);
    }
}
