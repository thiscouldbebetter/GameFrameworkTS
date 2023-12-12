"use strict";
class Goal {
    constructor(numberOfKeysToUnlock) {
        this.numberOfKeysToUnlock = numberOfKeysToUnlock;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
    // Equatable
    equals(other) { return false; } // todo
}
