"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VenueCarousel {
            constructor(name, loopsBackToSlideFirstAfterLast, secondsPerSlideMax, inputToAdvanceToNextSlide, inputToSkipToEndOfSlideshow, venuesForSlides, done) {
                this.name = name;
                this.loopsBackToSlideFirstAfterLast = loopsBackToSlideFirstAfterLast;
                this.secondsPerSlideMax = secondsPerSlideMax;
                this.inputToAdvanceToNextSlide =
                    inputToAdvanceToNextSlide || GameFramework.Input.Instances().Enter;
                this.inputToSkipToEndOfSlideshow =
                    inputToSkipToEndOfSlideshow || GameFramework.Input.Instances().Escape;
                this.venuesForSlides = venuesForSlides;
                this._done = done;
                this.slideCurrentIndex = 0;
                this.timeSlideCurrentStartedAt = new Date();
            }
            static fromNameLoopSecondsInputsAdvanceAndSkipSlidesAndDone(name, loopsBackToSlideFirstAfterLast, secondsPerSlideMax, inputToAdvanceToNextSlide, inputToSkipToEndOfSlideshow, venuesForSlides, done) {
                return new VenueCarousel(name, loopsBackToSlideFirstAfterLast, secondsPerSlideMax, inputToAdvanceToNextSlide, inputToSkipToEndOfSlideshow, venuesForSlides, done);
            }
            static fromSecondsVenuesForSlidesAndDoneLooping(secondsPerSlide, venuesForSlides, done) {
                var inputs = GameFramework.Input.Instances();
                return new VenueCarousel(VenueCarousel.name, true, // loopsBackToSlideFirstAfterLast,
                secondsPerSlide, inputs.Enter, // inputToAdvanceToNextSlide,
                inputs.Escape, // inputToSkipToEndOfSlideshow,
                venuesForSlides, done);
            }
            advanceToSlideNext(universe) {
                var slideVenueCurrent = this.slideVenueCurrent();
                slideVenueCurrent.finalize(universe);
                var slideNextIndex = this.slideCurrentIndex + 1;
                if (slideNextIndex >= this.venuesForSlides.length) {
                    slideNextIndex = 0;
                    if (this.loopsBackToSlideFirstAfterLast == false) {
                        this.done(universe);
                    }
                }
                this.slideCurrentIndex = slideNextIndex;
                this.timeSlideCurrentStartedAt = new Date();
                var slideVenueCurrent = this.slideVenueCurrent();
                slideVenueCurrent.initialize(universe);
            }
            done(universe) {
                if (this._done != null) {
                    this._done.call(this, universe);
                }
            }
            slideVenueCurrent() {
                var slideVenue = this.venuesForSlides[this.slideCurrentIndex];
                return slideVenue;
            }
            skipToEndOfSlideshow(universe) {
                this._done(universe);
            }
            // Venue.
            draw(universe) {
                var slideVenueCurrent = this.slideVenueCurrent();
                slideVenueCurrent.draw(universe);
            }
            finalize(universe) { }
            finalizeIsComplete() { return true; }
            initialize(universe) { }
            initializeIsComplete(universe) { return true; }
            updateForTimerTick(universe) {
                var slideVenueCurrent = this.slideVenueCurrent();
                slideVenueCurrent.updateForTimerTick(universe);
                var now = new Date();
                var millisecondsSinceSlideCurrentStarted = now.getTime() - this.timeSlideCurrentStartedAt.getTime();
                var secondsSinceSlideCurrentStarted = millisecondsSinceSlideCurrentStarted / 1000;
                if (secondsSinceSlideCurrentStarted > this.secondsPerSlideMax) {
                    this.advanceToSlideNext(universe);
                }
                else {
                    var inputTracker = universe.inputTracker;
                    var inputsActive = inputTracker.inputsActive();
                    for (var i = 0; i < inputsActive.length; i++) {
                        var inputActive = inputsActive[i];
                        if (inputActive == this.inputToAdvanceToNextSlide) {
                            this.advanceToSlideNext(universe);
                        }
                        else if (inputActive == this.inputToSkipToEndOfSlideshow) {
                            this.skipToEndOfSlideshow(universe);
                        }
                    }
                }
            }
        }
        GameFramework.VenueCarousel = VenueCarousel;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
