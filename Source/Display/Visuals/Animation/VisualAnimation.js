"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualAnimation {
            constructor(name, ticksToHoldFrames, frames, isRepeating) {
                this.name = name;
                this.ticksToHoldFrames = ticksToHoldFrames || frames.map(x => 1);
                this.frames = frames;
                this.isRepeating = (isRepeating == null ? true : isRepeating);
                if (this.ticksToHoldFrames == null) {
                    this.ticksToHoldFrames = [];
                    for (var f = 0; f < this.frames.length; f++) {
                        this.ticksToHoldFrames.push(1);
                    }
                }
                else if (this.ticksToHoldFrames.length < this.frames.length) {
                    for (var f = 0; f < this.frames.length; f++) {
                        if (f >= this.ticksToHoldFrames.length) {
                            this.ticksToHoldFrames.push(this.ticksToHoldFrames[f % this.ticksToHoldFrames.length]);
                        }
                    }
                }
                this.ticksToComplete = 0;
                for (var f = 0; f < this.ticksToHoldFrames.length; f++) {
                    this.ticksToComplete += this.ticksToHoldFrames[f];
                }
            }
            static fromFrames(frames) {
                var name = VisualAnimation.name + frames[0].constructor.name + frames.length;
                return this.fromNameAndFrames(name, frames);
            }
            static fromFramesRepeating(frames) {
                var name = VisualAnimation.name + frames[0].constructor.name + frames.length;
                return this.fromNameFramesAndIsRepeating(name, frames, true);
            }
            static fromNameAndFrames(name, frames) {
                return VisualAnimation.fromNameFramesAndIsRepeating(name, frames, false // isRepeating - This should probably be true, which is the default, but it hasn't been.
                );
            }
            static fromNameFramesAndIsRepeating(name, frames, isRepeating) {
                var ticksToHoldFrames = frames.map(x => 1);
                var returnValue = new VisualAnimation(name, ticksToHoldFrames, frames, isRepeating);
                return returnValue;
            }
            frameCurrent(world, tickStarted) {
                var frameIndexCurrent = this.frameIndexCurrent(world, tickStarted);
                var frameCurrent = this.frames[frameIndexCurrent];
                return frameCurrent;
            }
            frameIndexCurrent(world, tickStarted) {
                var returnValue = null;
                var ticksSinceStarted = world.timerTicksSoFar - tickStarted;
                if (ticksSinceStarted >= this.ticksToComplete) {
                    if (this.isRepeating) {
                        ticksSinceStarted = ticksSinceStarted % this.ticksToComplete;
                    }
                    else {
                        returnValue = this.frames.length - 1;
                    }
                }
                if (returnValue == null) {
                    var ticksForFramesSoFar = 0;
                    var f = 0;
                    for (f = 0; f < this.ticksToHoldFrames.length; f++) {
                        var ticksToHoldFrame = this.ticksToHoldFrames[f];
                        ticksForFramesSoFar += ticksToHoldFrame;
                        if (ticksForFramesSoFar > ticksSinceStarted) {
                            break;
                        }
                    }
                    returnValue = f;
                }
                return returnValue;
            }
            isComplete(world, tickStarted) {
                var ticksSinceStarted = world.timerTicksSoFar - tickStarted;
                var returnValue = (ticksSinceStarted >= this.ticksToComplete);
                return returnValue;
            }
            // Visual.
            draw(uwpe, display) {
                var world = uwpe.world;
                var entity = uwpe.entity;
                var animatable = GameFramework.Animatable2 == null
                    ? null
                    : GameFramework.Animatable2.of(entity);
                var tickStarted = animatable == null
                    ? 0
                    : animatable.animationWithNameStartIfNecessary(this.name, world);
                var frameCurrent = this.frameCurrent(world, tickStarted);
                frameCurrent.draw(uwpe, display);
            }
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
        GameFramework.VisualAnimation = VisualAnimation;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
