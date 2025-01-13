"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VenueInputCapture {
            constructor(venueToReturnTo, functionToPassInputCapturedTo) {
                this.venueToReturnTo = venueToReturnTo;
                this.functionToPassInputCapturedTo = functionToPassInputCapturedTo;
                this.isFirstTime = true;
            }
            draw(universe) {
                // Do nothing.
            }
            finalize(universe) { }
            finalizeIsComplete() { return true; }
            initialize(universe) { }
            initializeIsComplete() { return true; }
            updateForTimerTick(universe) {
                var inputHelper = universe.inputHelper;
                if (this.isFirstTime) {
                    this.isFirstTime = false;
                    inputHelper.inputsRemoveAll();
                }
                else {
                    var inputsPressed = inputHelper.inputsPressed;
                    for (var i = 0; i < inputsPressed.length; i++) {
                        var inputPressed = inputsPressed[i];
                        if (inputPressed.name.startsWith("Mouse") == false) {
                            if (inputPressed.isActive) {
                                this.functionToPassInputCapturedTo(inputPressed);
                                universe.venueNextSet(this.venueToReturnTo);
                            }
                        }
                    }
                }
            }
        }
        GameFramework.VenueInputCapture = VenueInputCapture;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
