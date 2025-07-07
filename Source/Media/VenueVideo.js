"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VenueVideo {
            constructor(videoName, venueNext) {
                this.videoName = videoName;
                this.venueNext = venueNext;
                this.hasVideoBeenStarted = false;
                var inputs = GameFramework.Input.Instances();
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                this.actionToInputsMappings =
                    [
                        GameFramework.ActionToInputsMapping.fromActionNameAndInputNames(controlActionNames.ControlCancel, [
                            inputs.Escape.name,
                            inputs.GamepadButton0.name + "0"
                        ]),
                    ];
                this.actionToInputsMappingsByInputName =
                    GameFramework.ArrayHelper.addLookupsMultiple(this.actionToInputsMappings, (x) => x.inputNames);
            }
            draw() {
                // do nothing
            }
            finalize(universe) { }
            finalizeIsComplete() { return true; }
            initialize(universe) { }
            initializeIsComplete() { return true; }
            updateForTimerTick(universe) {
                if (this.video == null) {
                    universe.platformHelper.platformableHide(universe.display);
                    this.video = universe.videoHelper.videosByName.get(this.videoName);
                    this.video.play(universe);
                }
                if (this.video.isFinished == false) {
                    var shouldVideoBeStopped = false;
                    var inputHelper = universe.inputHelper;
                    if (inputHelper.isMouseClicked()) {
                        inputHelper.mouseClickedSet(false);
                        shouldVideoBeStopped = true;
                    }
                    else {
                        var controlActionNames = GameFramework.ControlActionNames.Instances();
                        var inputsPressed = inputHelper.inputsPressed;
                        for (var i = 0; i < inputsPressed.length; i++) {
                            var inputPressed = inputsPressed[i];
                            if (inputPressed.isActive) {
                                var actionToInputsMapping = this.actionToInputsMappingsByInputName.get(inputPressed.name);
                                if (actionToInputsMapping != null) {
                                    inputPressed.isActive = false;
                                    var actionName = actionToInputsMapping.actionName;
                                    if (actionName == controlActionNames.ControlCancel) {
                                        shouldVideoBeStopped = true;
                                    }
                                }
                            }
                        }
                    }
                    if (shouldVideoBeStopped) {
                        this.video.stop(universe.platformHelper);
                    }
                }
                if (this.video.isFinished) {
                    var display = universe.display;
                    var colorBlack = GameFramework.Color.Instances().Black;
                    display.drawBackgroundWithColorsBackAndBorder(colorBlack, null);
                    universe.platformHelper.platformableShow(display);
                    universe.venueTransitionTo(this.venueNext);
                }
            }
        }
        GameFramework.VenueVideo = VenueVideo;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
