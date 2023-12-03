"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VenueFader {
            constructor(venueToFadeTo, venueToFadeFrom, backgroundColor, millisecondsPerFade) {
                this.venuesToFadeFromAndTo =
                    [
                        venueToFadeFrom, venueToFadeTo
                    ];
                this.millisecondsPerFade = (millisecondsPerFade == null ? 250 : millisecondsPerFade);
                if (venueToFadeFrom == venueToFadeTo) {
                    this.venueIndexCurrent = 1;
                    this.millisecondsPerFade *= 2;
                }
                else {
                    this.venueIndexCurrent = 0;
                }
                this.backgroundColor =
                    (backgroundColor == null ? GameFramework.Color.Instances().Black : backgroundColor);
            }
            static fromVenueTo(venueToFadeTo) {
                return new VenueFader(venueToFadeTo, null, null, null);
            }
            static fromVenuesToAndFrom(venueToFadeTo, venueToFadeFrom) {
                return new VenueFader(venueToFadeTo, venueToFadeFrom, null, null);
            }
            finalize(universe) {
                var venueToFadeTo = this.venuesToFadeFromAndTo[1];
                universe.venueNextSet(venueToFadeTo);
            }
            initialize(universe) {
                var venueToFadeTo = this.venueToFadeTo();
                venueToFadeTo.initialize(universe);
            }
            updateForTimerTick(universe) {
                this.draw(universe);
                var now = new Date();
                if (this.timeFadeStarted == null) {
                    this.timeFadeStarted = now;
                }
                var millisecondsSinceFadeStarted = now.getTime() - this.timeFadeStarted.getTime();
                var fractionOfFadeCompleted = millisecondsSinceFadeStarted
                    / this.millisecondsPerFade;
                var alphaOfFadeColor;
                if (this.venueIndexCurrent == 0) {
                    if (fractionOfFadeCompleted > 1) {
                        fractionOfFadeCompleted = 1;
                        this.venueIndexCurrent++;
                        this.timeFadeStarted = null;
                        var venueToFadeTo = this.venuesToFadeFromAndTo[1];
                        if (venueToFadeTo.draw == null) {
                            universe.venueNextSet(venueToFadeTo);
                            universe.venueCurrentRemove();
                        }
                    }
                    alphaOfFadeColor = fractionOfFadeCompleted;
                }
                else // this.venueIndexCurrent == 1
                 {
                    if (fractionOfFadeCompleted > 1) {
                        fractionOfFadeCompleted = 1;
                        universe.venueNextSet(this.venueCurrent());
                        universe.venueCurrentRemove();
                    }
                    alphaOfFadeColor = 1 - fractionOfFadeCompleted;
                }
                alphaOfFadeColor *= alphaOfFadeColor;
                var fadeColor = this.backgroundColor.clone().alphaSet(alphaOfFadeColor * this.backgroundColor.alpha());
                var display = universe.display;
                display.drawRectangle(GameFramework.Coords.create(), display.sizeDefault(), // Scaled automatically.
                fadeColor, null);
            }
            venueToFadeFrom() {
                return this.venuesToFadeFromAndTo[0];
            }
            venueToFadeTo() {
                return this.venuesToFadeFromAndTo[1];
            }
            venueCurrent() {
                return this.venuesToFadeFromAndTo[this.venueIndexCurrent];
            }
            draw(universe) {
                var venueCurrent = this.venueCurrent();
                if (venueCurrent != null) {
                    venueCurrent.draw(universe);
                }
            }
        }
        GameFramework.VenueFader = VenueFader;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
