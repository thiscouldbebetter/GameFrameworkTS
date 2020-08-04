"use strict";
class VisualAnimation {
    constructor(name, ticksToHoldFrames, frames, isRepeating) {
        this.name = name;
        this.ticksToHoldFrames = ticksToHoldFrames;
        this.frames = frames;
        this.isRepeating = (isRepeating == null ? true : isRepeating);
        if (this.ticksToHoldFrames == null) {
            this.ticksToHoldFrames = [];
            for (var f = 0; f < this.frames.length; f++) {
                this.ticksToHoldFrames.push(1);
            }
        }
        this.ticksToComplete = 0;
        for (var f = 0; f < this.ticksToHoldFrames.length; f++) {
            this.ticksToComplete += this.ticksToHoldFrames[f];
        }
    }
    // visual
    draw(universe, world, place, entity, display) {
        this.update(universe, world, place, entity, display);
    }
    ;
    frameCurrent(world, drawable) {
        var frameIndexCurrent = this.frameIndexCurrent(world, drawable);
        var frameCurrent = this.frames[frameIndexCurrent];
        return frameCurrent;
    }
    ;
    frameIndexCurrent(world, drawable) {
        var returnValue = -1;
        var ticksSinceStarted = world.timerTicksSoFar - drawable.tickStarted;
        if (ticksSinceStarted >= this.ticksToComplete) {
            if (this.isRepeating) {
                ticksSinceStarted = ticksSinceStarted % this.ticksToComplete;
            }
            else {
                returnValue = this.frames.length - 1;
            }
        }
        if (returnValue < 0) {
            var ticksForFramesSoFar = 0;
            var f = 0;
            for (f = 0; f < this.ticksToHoldFrames.length; f++) {
                var ticksToHoldFrame = this.ticksToHoldFrames[f];
                ticksForFramesSoFar += ticksToHoldFrame;
                if (ticksForFramesSoFar >= ticksSinceStarted) {
                    break;
                }
            }
            returnValue = f;
        }
        return returnValue;
    }
    ;
    isComplete(world, drawable) {
        var ticksSinceStarted = world.timerTicksSoFar - drawable.tickStarted;
        var returnValue = (ticksSinceStarted >= this.ticksToComplete);
        return returnValue;
    }
    ;
    update(universe, world, place, entity, display) {
        var drawable = entity.drawable();
        if (drawable.tickStarted == null) {
            drawable.tickStarted = world.timerTicksSoFar;
        }
        var frameCurrent = this.frameCurrent(world, drawable);
        frameCurrent.draw(universe, world, place, entity, display);
    }
    ;
    // Clonable.
    clone() {
        return this; // todo
    }
    overwriteWith(other) {
        return this; // todo
    }
    // Transformable.
    transform(transformToApply) {
        return this; // todo
    }
}
