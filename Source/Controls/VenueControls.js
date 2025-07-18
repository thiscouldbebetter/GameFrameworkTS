"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VenueControls {
            constructor(controlRoot, ignoreKeyboardAndGamepadInputs) {
                this.controlRoot = controlRoot;
                ignoreKeyboardAndGamepadInputs = ignoreKeyboardAndGamepadInputs || false;
                this.actionToInputsMappings =
                    this.constructor_ActionToInputsMappingsBuild();
                if (ignoreKeyboardAndGamepadInputs) {
                    this.actionToInputsMappings.length = 0;
                }
                var mappingsGet = this.controlRoot.actionToInputsMappings;
                if (mappingsGet != null) {
                    var mappings = mappingsGet.call(this.controlRoot);
                    this.actionToInputsMappings.push(...mappings);
                }
                this.actionToInputsMappingsByInputName = GameFramework.ArrayHelper.addLookupsMultiple(this.actionToInputsMappings, (x) => x.inputNames);
                // Helper variables.
                this._drawLoc = GameFramework.Disposition.create();
                this._mouseClickPos = GameFramework.Coords.create();
                this._mouseMovePos = GameFramework.Coords.create();
                this._mouseMovePosPrev = GameFramework.Coords.create();
            }
            constructor_ActionToInputsMappingsBuild() {
                var buildGamepadInputs = (inputName) => {
                    var numberOfGamepads = 1; // todo
                    var returnValues = [];
                    for (var i = 0; i < numberOfGamepads; i++) {
                        var inputNameForGamepad = inputName + i;
                        returnValues.push(inputNameForGamepad);
                    }
                    return returnValues;
                };
                var controlActionNames = GameFramework.ControlActionNames.Instances();
                var inputs = GameFramework.Input.Instances();
                var inactivate = true;
                return new Array(new GameFramework.ActionToInputsMapping(controlActionNames.ControlIncrement, GameFramework.ArrayHelper.addMany([inputs.ArrowDown.name], buildGamepadInputs(inputs.GamepadMoveDown.name)), inactivate), new GameFramework.ActionToInputsMapping(controlActionNames.ControlPrev, GameFramework.ArrayHelper.addMany([inputs.ArrowLeft.name], buildGamepadInputs(inputs.GamepadMoveLeft.name)), inactivate), new GameFramework.ActionToInputsMapping(controlActionNames.ControlNext, GameFramework.ArrayHelper.addMany([inputs.ArrowRight.name], GameFramework.ArrayHelper.addMany([inputs.ArrowRight.name, inputs.Tab.name], buildGamepadInputs(inputs.GamepadMoveRight.name))), inactivate), new GameFramework.ActionToInputsMapping(controlActionNames.ControlDecrement, GameFramework.ArrayHelper.addMany([inputs.ArrowUp.name], buildGamepadInputs(inputs.GamepadMoveUp.name)), inactivate), new GameFramework.ActionToInputsMapping(controlActionNames.ControlConfirm, GameFramework.ArrayHelper.addMany([inputs.Enter.name], buildGamepadInputs(inputs.GamepadButton1.name)), inactivate), new GameFramework.ActionToInputsMapping(controlActionNames.ControlCancel, GameFramework.ArrayHelper.addMany([inputs.Escape.name], buildGamepadInputs(inputs.GamepadButton0.name)), inactivate));
            }
            static fromControl(controlRoot) {
                return new VenueControls(controlRoot, false);
            }
            draw(universe) {
                var display = universe.display;
                var drawLoc = this._drawLoc;
                drawLoc.pos.clear();
                var styleOverrideNone = null;
                this.controlRoot.draw(universe, display, drawLoc, styleOverrideNone);
            }
            finalize(universe) {
                this.controlRoot.finalize(universe);
            }
            finalizeIsComplete() {
                return true; // todo
            }
            initialize(universe) {
                this.controlRoot.initialize(universe);
            }
            initializeIsComplete(universe) {
                return this.controlRoot.initializeIsComplete(universe);
            }
            updateForTimerTick(universe) {
                this.draw(universe);
                var inputHelper = universe.inputHelper;
                var inputsPressed = inputHelper.inputsPressed;
                for (var i = 0; i < inputsPressed.length; i++) {
                    var inputPressed = inputsPressed[i];
                    if (inputPressed.isActive) {
                        this.updateForTimerTick_InputPressedIsActive(universe, inputPressed);
                    }
                }
            }
            updateForTimerTick_InputPressedIsActive(universe, inputPressed) {
                var inputHelper = universe.inputHelper;
                var inputs = GameFramework.Input.Instances();
                var inputPressedName = inputPressed.name;
                var mapping = this.actionToInputsMappingsByInputName.get(inputPressedName);
                if (inputPressedName.startsWith("Mouse") == false) {
                    if (mapping == null) {
                        // Pass the raw input, to allow for text entry.
                        var wasActionHandled = this.controlRoot.actionHandle(inputPressedName, universe);
                        if (wasActionHandled) {
                            inputPressed.isActive = false;
                        }
                    }
                    else {
                        var actionName = mapping.actionName;
                        this.controlRoot.actionHandle(actionName, universe);
                        if (mapping.inactivateInputWhenActionPerformed) {
                            inputPressed.isActive = false;
                        }
                    }
                }
                else if (inputPressedName == inputs.MouseClick.name) {
                    this._mouseClickPos.overwriteWith(inputHelper.mouseClickPos).divide(universe.display.scaleFactor());
                    var wasClickHandled = this.controlRoot.mouseClick(this._mouseClickPos);
                    if (wasClickHandled) {
                        //inputHelper.inputRemove(inputPressed);
                        inputPressed.isActive = false;
                    }
                }
                else if (inputPressedName == inputs.MouseMove.name) {
                    this._mouseMovePos.overwriteWith(inputHelper.mouseMovePos).divide(universe.display.scaleFactor());
                    this._mouseMovePosPrev.overwriteWith(inputHelper.mouseMovePosPrev).divide(universe.display.scaleFactor());
                    this.controlRoot.mouseMove(this._mouseMovePos //, this._mouseMovePosPrev
                    );
                }
            }
        }
        GameFramework.VenueControls = VenueControls;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
