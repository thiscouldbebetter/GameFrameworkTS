"use strict";
class VisualAnimationGroup {
    constructor(name, animations) {
        this.name = name;
        this.animations = animations;
        this.animationsByName = ArrayHelper.addLookupsByName(this.animations);
    }
    // visual
    animationGetByName(name) {
        return this.animationsByName.get(name);
    }
    draw(universe, world, place, entity, display) {
        var animatable = entity.drawable().animatable();
        var animationNames = animatable.animationsRunningNames();
        for (var i = 0; i < animationNames.length; i++) {
            var animationName = animationNames[i];
            var animation = this.animationsByName.get(animationName);
            animation.draw(universe, world, place, entity, display);
            var tickStarted = animatable.animationWithNameStartIfNecessary(name, world);
            if (animation.isComplete(world, tickStarted)) {
                animatable.animationStopByName(animationName);
            }
        }
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
