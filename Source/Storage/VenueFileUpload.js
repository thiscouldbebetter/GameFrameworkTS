"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VenueFileUpload {
            constructor(venueNextIfFileSpecified, venueNextIfCancelled) {
                this.venueNextIfFileSpecified = venueNextIfFileSpecified;
                this.venueNextIfCancelled = venueNextIfCancelled;
                var inputs = GameFramework.Input.Instances();
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                this.actionToInputsMappings =
                    [
                        new GameFramework.ActionToInputsMapping(controlActionNames.ControlCancel, [
                            inputs.Escape.name,
                            inputs.GamepadButton0.name + "0"
                        ], true),
                    ];
                this.actionToInputsMappingsByInputName =
                    GameFramework.ArrayHelper.addLookupsMultiple(this.actionToInputsMappings, (x) => x.inputNames);
            }
            static create() {
                return new VenueFileUpload(null, null);
            }
            // venue
            draw(universe) { }
            finalize(universe) {
                var platformHelper = universe.platformHelper;
                platformHelper.platformableRemove(this);
                var display = universe.display;
                var colorBlack = GameFramework.Color.Instances().Black;
                display.drawBackgroundWithColorsBackAndBorder(colorBlack, null);
                platformHelper.platformableShow(display);
            }
            finalizeIsComplete() { return true; }
            initialize(universe) {
                var display = universe.display;
                universe.platformHelper.platformableHide(display);
                if (this.domElement == null) {
                    var d = document;
                    var divFileUpload = d.createElement("div");
                    /*
                    // todo - Style is read-only?
                    divFileUpload.style =
                        "border:1px solid;width:" + display.sizeInPixels.x
                        + ";height:" + display.sizeInPixels.y;
                    */
                    var labelInstructions = d.createElement("label");
                    labelInstructions.innerHTML =
                        "Choose a file and click Load."
                            + "  Due to web browser security features,"
                            + " a mouse or keyboard will likely be necessary.";
                    divFileUpload.appendChild(labelInstructions);
                    var inputFileUpload = d.createElement("input");
                    inputFileUpload.type = "file";
                    var divInputFileUpload = d.createElement("div");
                    divInputFileUpload.appendChild(inputFileUpload);
                    divFileUpload.appendChild(divInputFileUpload);
                    var buttonLoad = d.createElement("button");
                    buttonLoad.innerHTML = "Load";
                    buttonLoad.onclick = this.buttonLoad_Clicked.bind(this, universe);
                    var buttonCancel = d.createElement("button");
                    buttonCancel.innerHTML = "Cancel";
                    buttonCancel.onclick = this.buttonCancel_Clicked.bind(this, universe);
                    var divButtons = d.createElement("div");
                    divButtons.appendChild(buttonLoad);
                    divButtons.appendChild(buttonCancel);
                    divFileUpload.appendChild(divButtons);
                    this.domElement = divFileUpload;
                    universe.platformHelper.platformableAdd(this);
                    inputFileUpload.focus();
                }
            }
            initializeIsComplete() { return true; }
            updateForTimerTick(universe) {
                var inputTracker = universe.inputTracker;
                var inputsPressed = inputTracker.inputsPressed;
                for (var i = 0; i < inputsPressed.length; i++) {
                    var inputPressed = inputsPressed[i];
                    if (inputPressed.isActive == true) {
                        var actionToInputsMapping = this.actionToInputsMappingsByInputName.get(inputPressed.name);
                        if (actionToInputsMapping != null) {
                            inputPressed.isActive = false;
                            var actionName = actionToInputsMapping.actionName;
                            if (actionName == GameFramework.ControlActionNames.Instances().ControlCancel) {
                                universe.venueTransitionTo(this.venueNextIfCancelled);
                            }
                        }
                    }
                }
            }
            // events
            buttonCancel_Clicked(universe, event) {
                universe.venueTransitionTo(this.venueNextIfCancelled);
            }
            buttonLoad_Clicked(universe, event) {
                var inputFileUpload = this.domElement.getElementsByTagName("input")[0];
                var fileToLoad = inputFileUpload.files[0];
                if (fileToLoad != null) {
                    universe.venueTransitionTo(this.venueNextIfFileSpecified);
                }
            }
            // platformable
            toDomElement() {
                return this.domElement;
            }
        }
        GameFramework.VenueFileUpload = VenueFileUpload;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
