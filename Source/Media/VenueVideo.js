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
                var inputNames = GameFramework.Input.Names();
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                this.actionToInputsMappings =
                    [
                        new GameFramework.ActionToInputsMapping(controlActionNames.ControlCancel, [inputNames.Escape, inputNames.GamepadButton0 + "0"], true),
                    ];
                this.actionToInputsMappingsByInputName =
                    GameFramework.ArrayHelper.addLookupsMultiple(this.actionToInputsMappings, (x) => x.inputNames);
            }
            draw() {
                // do nothing
            }
            finalize(universe) { }
            initialize(universe) { }
            updateForTimerTick(universe) {
                if (this.video == null) {
                    universe.platformHelper.platformableHide(universe.display);
                    this.video = universe.videoHelper.videosByName.get(this.videoName);
                    this.video.play(universe);
                }
                if (this.video.isFinished == false) {
                    var shouldVideoBeStopped = false;
                    var inputHelper = universe.inputHelper;
                    if (inputHelper.isMouseClicked(null)) {
                        inputHelper.isMouseClicked(false);
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
                    var colorBlack = GameFramework.Color.byName("Black");
                    display.drawBackground(colorBlack, colorBlack);
                    universe.platformHelper.platformableShow(display);
                    universe.venueNext = universe.controlBuilder.venueTransitionalFromTo(this, this.venueNext);
                }
            }
        }
        GameFramework.VenueVideo = VenueVideo;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
