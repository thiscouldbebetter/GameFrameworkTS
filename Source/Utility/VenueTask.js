"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VenueTask {
            constructor(venueInner, perform, done) {
                this.venueInner = venueInner;
                this.perform = perform;
                this.done = done;
                this.timeStarted = null;
            }
            static fromVenueInnerPerformAndDone(venueInner, perform, done) {
                return new VenueTask(venueInner, perform, done);
            }
            secondsSinceStarted() {
                var returnValue = 0;
                if (this.timeStarted != null) {
                    var now = new Date();
                    var millisecondsSinceStarted = now.getTime() - this.timeStarted.getTime();
                    returnValue = Math.floor(millisecondsSinceStarted / 1000);
                }
                return returnValue;
            }
            // Venue implementation.
            draw(universe) {
                this.venueInner.draw(universe);
            }
            finalize(universe) { }
            finalizeIsComplete() { return true; }
            initialize(universe) { }
            initializeIsComplete() { return true; }
            updateForTimerTick(universe) {
                this.venueInner.updateForTimerTick(universe);
                this.timeStarted = new Date();
                var timerHandle = setInterval(() => { this.draw(universe), 1000; });
                // todo - Make this asynchronous.
                var result = this.perform();
                clearInterval(timerHandle);
                this.done(result);
                universe.venueCurrentRemove();
            }
        }
        GameFramework.VenueTask = VenueTask;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
