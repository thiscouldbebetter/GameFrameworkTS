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
                var atim = (an, ins) => GameFramework.ActionToInputsMapping.fromActionNameInputNamesAndOnlyOnce(an, ins, true);
                var mappings = [
                    atim(controlActionNames.ControlIncrement, GameFramework.ArrayHelper.addMany([inputs.ArrowDown.name], buildGamepadInputs(inputs.GamepadMoveDown.name))),
                    atim(controlActionNames.ControlPrev, GameFramework.ArrayHelper.addMany([inputs.ArrowLeft.name], buildGamepadInputs(inputs.GamepadMoveLeft.name))),
                    atim(controlActionNames.ControlNext, GameFramework.ArrayHelper.addMany([inputs.ArrowRight.name], GameFramework.ArrayHelper.addMany([inputs.ArrowRight.name, inputs.Tab.name], buildGamepadInputs(inputs.GamepadMoveRight.name)))),
                    atim(controlActionNames.ControlDecrement, GameFramework.ArrayHelper.addMany([inputs.ArrowUp.name], buildGamepadInputs(inputs.GamepadMoveUp.name))),
                    atim(controlActionNames.ControlConfirm, GameFramework.ArrayHelper.addMany([inputs.Enter.name], buildGamepadInputs(inputs.GamepadButton1.name))),
                    atim(controlActionNames.ControlCancel, GameFramework.ArrayHelper.addMany([inputs.Escape.name], buildGamepadInputs(inputs.GamepadButton0.name)))
                ];
                return mappings;
            }
            static fromControl(controlRoot) {
                return new VenueControls(controlRoot, false);
            }
            actionToInputsMappingByInputName(inputName) {
                return this.actionToInputsMappingsByInputName.get(inputName);
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
                var inputTracker = universe.inputTracker;
                var inputsPressed = inputTracker.inputsPressed;
                for (var i = 0; i < inputsPressed.length; i++) {
                    var inputPressed = inputsPressed[i];
                    if (inputPressed.isActive) {
                        this.updateForTimerTick_InputPressedIsActive(universe, inputPressed);
                    }
                }
            }
            updateForTimerTick_InputPressedIsActive(universe, inputPressed) {
                var inputTracker = universe.inputTracker;
                var inputs = GameFramework.Input.Instances();
                var inputPressedName = inputPressed.name;
                var mapping = this.actionToInputsMappingByInputName(inputPressedName);
                var scaleFactor = universe.display.scaleFactor();
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
                    var mouseClickPos = this._mouseClickPos;
                    mouseClickPos
                        .overwriteWith(inputTracker.mouseClickPos)
                        .divide(scaleFactor);
                    var wasClickHandled = this.controlRoot.mouseClick(mouseClickPos);
                    if (wasClickHandled) {
                        inputPressed.isActive = false;
                    }
                }
                else if (inputPressedName == inputs.MouseMove.name) {
                    var mouseMovePos = this._mouseMovePos;
                    mouseMovePos
                        .overwriteWith(inputTracker.mouseMovePos)
                        .divide(scaleFactor);
                    this._mouseMovePosPrev
                        .overwriteWith(inputTracker.mouseMovePosPrev)
                        .divide(scaleFactor);
                    this.controlRoot
                        .mouseMove(mouseMovePos);
                }
            }
        }
        GameFramework.VenueControls = VenueControls;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
