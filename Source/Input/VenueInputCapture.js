"use strict";
class VenueInputCapture {
    constructor(venueToReturnTo, functionToPassInputCapturedTo) {
        this.venueToReturnTo = venueToReturnTo;
        this.functionToPassInputCapturedTo = functionToPassInputCapturedTo;
        this.isFirstTime = true;
    }
    draw(universe) {
        // Do nothing.
    }
    ;
    finalize(universe) { }
    initialize(universe) { }
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
                        universe.venueNext = this.venueToReturnTo;
                    }
                }
            }
        }
    }
    ;
}
