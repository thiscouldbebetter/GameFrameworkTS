"use strict";
class VisualSound {
    constructor(soundNameToPlay) {
        this.soundNameToPlay = soundNameToPlay;
    }
    draw(universe, world, display, entity) {
        universe.soundHelper.soundWithNamePlayAsEffect(universe, this.soundNameToPlay);
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
