"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class InputHelper {
            constructor() {
                // Helper variables.
                this.mouseClickPos = GameFramework.Coords.create();
                this.mouseMovePos = GameFramework.Coords.create();
                this.mouseMovePosPrev = GameFramework.Coords.create();
                this.mouseMovePosNext = GameFramework.Coords.create();
                var inputNames = GameFramework.Input.Names();
                this.inputNamesLookup = inputNames._AllByName;
                this.keysToPreventDefaultsFor =
                    [
                        inputNames.ArrowDown,
                        inputNames.ArrowLeft,
                        inputNames.ArrowRight,
                        inputNames.ArrowUp,
                        inputNames.F5,
                        inputNames.Tab
                    ];
                this.inputsPressed = [];
                this.inputsPressedByName = new Map();
                this.isEnabled = true;
                this.isMouseMovementTracked = true;
                this.isMouseWheelTracked = false;
            }
            actionsFromInput(actionsByName, actionToInputsMappingsByInputName) {
                var actionsSoFar = new Array();
                if (this.isEnabled == false) {
                    return actionsSoFar;
                }
                var inputsPressed = this.inputsPressed;
                for (var i = 0; i < inputsPressed.length; i++) {
                    var inputPressed = inputsPressed[i];
                    if (inputPressed.isActive) {
                        var mapping = actionToInputsMappingsByInputName.get(inputPressed.name);
                        if (mapping != null) {
                            var actionName = mapping.actionName;
                            var action = actionsByName.get(actionName);
                            if (actionsSoFar.indexOf(action) == -1) {
                                actionsSoFar.push(action);
                            }
                            if (mapping.inactivateInputWhenActionPerformed) {
                                inputPressed.isActive = false;
                            }
                        }
                    }
                }
                return actionsSoFar;
            }
            initialize(universe) {
                this.inputsPressed = [];
                this.gamepadsConnected = [];
                if (universe == null) {
                    // hack - Allows use of this class
                    // without including PlatformHelper or Universe.
                    this.toDomElement(null);
                }
                else {
                    universe.platformHelper.platformableAdd(this);
                }
                this.gamepadsCheck();
            }
            inputAdd(inputPressedName) {
                if (this.inputsPressedByName.has(inputPressedName) == false) {
                    var inputPressed = new GameFramework.Input(inputPressedName);
                    this.inputsPressedByName.set(inputPressedName, inputPressed);
                    this.inputsPressed.push(inputPressed);
                }
            }
            inputRemove(inputReleasedName) {
                if (this.inputsPressedByName.has(inputReleasedName)) {
                    var inputReleased = this.inputsPressedByName.get(inputReleasedName);
                    this.inputsPressedByName.delete(inputReleasedName);
                    GameFramework.ArrayHelper.remove(this.inputsPressed, inputReleased);
                }
            }
            inputsActive() {
                var inputsActive = this.inputsPressed.filter((x) => x.isActive);
                return inputsActive;
            }
            inputsRemoveAll() {
                for (var i = 0; i < this.inputsPressed.length; i++) {
                    var input = this.inputsPressed[i];
                    this.inputRemove(input.name);
                }
            }
            isMouseClicked() {
                var returnValue = false;
                var inputNameMouseClick = GameFramework.Input.Names().MouseClick;
                var inputPressed = this.inputsPressedByName.get(inputNameMouseClick);
                returnValue = (inputPressed != null && inputPressed.isActive);
                return returnValue;
            }
            mouseClickedSet(value) {
                var inputNameMouseClick = GameFramework.Input.Names().MouseClick;
                if (value == true) {
                    this.inputAdd(inputNameMouseClick);
                }
                else {
                    this.inputRemove(inputNameMouseClick);
                }
            }
            pause() {
                this.isEnabled = false;
            }
            unpause() {
                this.isEnabled = true;
            }
            updateForTimerTick(universe) {
                this.updateForTimerTick_Gamepads(universe);
            }
            updateForTimerTick_Gamepads(universe) {
                var systemGamepads = this.systemGamepads();
                var inputNames = GameFramework.Input.Names();
                for (var i = 0; i < this.gamepadsConnected.length; i++) {
                    var gamepad = this.gamepadsConnected[i];
                    var systemGamepad = systemGamepads[gamepad.index];
                    gamepad.updateFromSystemGamepad(systemGamepad);
                    var gamepadID = "Gamepad" + i;
                    var axisDisplacements = gamepad.axisDisplacements;
                    for (var a = 0; a < axisDisplacements.length; a++) {
                        var axisDisplacement = axisDisplacements[a];
                        if (axisDisplacement == 0) {
                            if (a == 0) {
                                this.inputRemove(inputNames.GamepadMoveLeft + i);
                                this.inputRemove(inputNames.GamepadMoveRight + i);
                            }
                            else {
                                this.inputRemove(inputNames.GamepadMoveUp + i);
                                this.inputRemove(inputNames.GamepadMoveDown + i);
                            }
                        }
                        else {
                            var gamepadIDMove = gamepadID + "Move"; // todo
                            var directionName;
                            if (a == 0) {
                                directionName = (axisDisplacement < 0 ? "Left" : "Right");
                            }
                            else {
                                directionName = (axisDisplacement < 0 ? "Up" : "Down");
                            }
                            this.inputAdd(gamepadIDMove + directionName);
                        }
                    } // end for
                    var gamepadIDButton = gamepadID + "Button";
                    var areButtonsPressed = gamepad.buttonsPressed;
                    for (var b = 0; b < areButtonsPressed.length; b++) {
                        var isButtonPressed = areButtonsPressed[b];
                        if (isButtonPressed) {
                            this.inputAdd(gamepadIDButton + b);
                        }
                        else {
                            this.inputRemove(gamepadIDButton + b);
                        }
                    }
                }
            }
            // events
            // events - keyboard
            handleEventKeyDown(event) {
                var inputPressed = event.key;
                if (this.keysToPreventDefaultsFor.indexOf(inputPressed) >= 0) {
                    event.preventDefault();
                }
                this.inputAdd(inputPressed);
            }
            handleEventKeyUp(event) {
                var inputReleased = event.key;
                this.inputRemove(inputReleased);
            }
            // events - mouse
            handleEventMouseDown(event) {
                var canvas = event.target;
                var canvasBox = canvas.getBoundingClientRect();
                this.mouseClickPos.overwriteWithDimensions(event.clientX - canvasBox.left, event.clientY - canvasBox.top, 0);
                this.inputAdd(GameFramework.Input.Names().MouseClick);
            }
            handleEventMouseMove(event) {
                var canvas = event.target;
                var canvasBox = canvas.getBoundingClientRect();
                this.mouseMovePosNext.overwriteWithDimensions(event.clientX - canvasBox.left, event.clientY - canvasBox.top, 0);
                if (this.mouseMovePosNext.equals(this.mouseMovePos) == false) {
                    this.mouseMovePosPrev.overwriteWith(this.mouseMovePos);
                    this.mouseMovePos.overwriteWith(this.mouseMovePosNext);
                    this.inputAdd(GameFramework.Input.Names().MouseMove);
                }
            }
            handleEventMouseUp(event) {
                this.inputRemove(GameFramework.Input.Names().MouseClick);
            }
            handleEventMouseWheel(event) {
                if (this.isMouseWheelTracked) {
                    var wheelMovementAmountInPixels = event.deltaY; // Seems a strange unit.
                    var inputNames = GameFramework.Input.Names();
                    var inputName = wheelMovementAmountInPixels > 0
                        ? inputNames.MouseWheelDown
                        : inputNames.MouseWheelUp;
                    this.inputAdd(inputName);
                }
            }
            // Events - Touch.
            handleEventTouchStart(event) {
                event.preventDefault();
                var touches = event.targetTouches;
                if (touches.length > 0) {
                    var touch = touches[0];
                    var canvas = event.target;
                    var canvasBox = canvas.getBoundingClientRect();
                    this.mouseClickPos.overwriteWithDimensions(touch.clientX - canvasBox.left, touch.clientY - canvasBox.top, 0);
                    this.inputAdd(GameFramework.Input.Names().MouseClick);
                }
            }
            handleEventTouchEnd(event) {
                this.inputRemove(GameFramework.Input.Names().MouseClick);
            }
            // gamepads
            gamepadsCheck() {
                var systemGamepads = this.systemGamepads();
                for (var i = 0; i < systemGamepads.length; i++) {
                    var systemGamepad = systemGamepads[i];
                    if (systemGamepad != null) {
                        var gamepad = new InputGamepad(i, systemGamepad); // todo
                        this.gamepadsConnected.push(gamepad);
                    }
                }
            }
            systemGamepads() {
                return navigator.getGamepads();
            }
            // Platformable.
            toDomElement(platformHelper) {
                document.body.onkeydown = this.handleEventKeyDown.bind(this);
                document.body.onkeyup = this.handleEventKeyUp.bind(this);
                var divMain = (platformHelper == null
                    ? document.getElementById("divMain")
                    : platformHelper.divMain);
                divMain.onmousedown = this.handleEventMouseDown.bind(this);
                divMain.onmouseup = this.handleEventMouseUp.bind(this);
                divMain.onmousemove =
                    (this.isMouseMovementTracked
                        ? this.handleEventMouseMove.bind(this)
                        : null);
                divMain.addEventListener("wheel", this.handleEventMouseWheel.bind(this), { passive: true });
                divMain.ontouchstart = this.handleEventTouchStart.bind(this);
                divMain.ontouchend = this.handleEventTouchEnd.bind(this);
                return null;
            }
        }
        GameFramework.InputHelper = InputHelper;
        class InputGamepad {
            constructor(index, systemGamepad) {
                this.index = index;
                this.systemGamepad = systemGamepad;
                this.buttonsPressed = new Array();
                this.axisDisplacements = new Array();
            }
            updateFromSystemGamepad(systemGamepad) {
                // todo
            }
        }
        GameFramework.InputGamepad = InputGamepad;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
