"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Trigger {
            constructor(name, isTriggered, reactToBeingTriggered) {
                this.name = name;
                this.isTriggered = isTriggered;
                this.reactToBeingTriggered = reactToBeingTriggered;
                this.hasBeenTriggered = false;
            }
            updateForTimerTick(uwpe) {
                if (this.hasBeenTriggered == false) {
                    this.hasBeenTriggered = this.isTriggered(uwpe);
                    if (this.hasBeenTriggered) {
                        this.reactToBeingTriggered(uwpe);
                    }
                }
            }
            // Clonable.
            clone() {
                return new Trigger(this.name, this.isTriggered, this.reactToBeingTriggered);
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.Trigger = Trigger;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
