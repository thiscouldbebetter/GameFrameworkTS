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
            initialize(universe) { }
            updateForTimerTick(universe) {
                this.venueInner.updateForTimerTick(universe);
                this.timeStarted = new Date();
                var timer = setInterval(() => { this.draw(universe), 1000; });
                // todo - Make this asynchronous.
                var result = this.perform(universe);
                clearInterval(timer);
                this.done(universe, result);
            }
        }
        GameFramework.VenueTask = VenueTask;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
