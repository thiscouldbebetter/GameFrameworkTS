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
                var inputs = GameFramework.Input.Instances();
                this.keysToPreventDefaultsFor =
                    [
                        inputs.ArrowDown.symbol,
                        inputs.ArrowLeft.symbol,
                        inputs.ArrowRight.symbol,
                        inputs.ArrowUp.symbol,
                        inputs.F5.symbol,
                        inputs.Tab.symbol
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
            finalize(universe) {
                var d = document;
                d.body.onkeydown = null;
                d.body.onkeyup = null;
                var platformHelper = universe.platformHelper;
                var divMain = (platformHelper == null
                    ? d.getElementById("divMain")
                    : platformHelper.divMain);
                divMain.onmousedown = null;
                divMain.onmouseup = null;
                divMain.onmousemove = null;
                divMain.onwheel = null;
                divMain.ontouchstart = null;
                divMain.ontouchend = null;
                return null;
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
            inputAdd(inputPressed) {
                var inputPressedName = inputPressed.name;
                if (this.inputsPressedByName.has(inputPressedName) == false) {
                    inputPressed.isActive = true;
                    this.inputsPressedByName.set(inputPressedName, inputPressed);
                    this.inputsPressed.push(inputPressed);
                }
            }
            inputRemove(inputReleased) {
                var inputReleasedName = inputReleased.name;
                if (this.inputsPressedByName.has(inputReleasedName)) {
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
                    this.inputRemove(input);
                }
            }
            isMouseClicked() {
                var returnValue = false;
                var inputNameMouseClick = GameFramework.Input.Instances().MouseClick.name;
                var inputPressed = this.inputsPressedByName.get(inputNameMouseClick);
                returnValue =
                    (inputPressed != null && inputPressed.isActive);
                return returnValue;
            }
            mouseClickedSet(value) {
                var inputMouseClick = GameFramework.Input.Instances().MouseClick;
                if (value == true) {
                    this.inputAdd(inputMouseClick);
                }
                else {
                    this.inputRemove(inputMouseClick);
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
                var inputs = GameFramework.Input.Instances();
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
                                var inputLeftName = inputs.GamepadMoveLeft.name + i;
                                var inputLeft = inputs.byName(inputLeftName);
                                this.inputRemove(inputLeft);
                                var inputRightName = inputs.GamepadMoveRight.name + i;
                                var inputRight = inputs.byName(inputRightName);
                                this.inputRemove(inputRight);
                            }
                            else {
                                var inputUpName = inputs.GamepadMoveUp.name + i;
                                var inputUp = inputs.byName(inputUpName);
                                this.inputRemove(inputUp);
                                var inputDownName = inputs.GamepadMoveDown.name + i;
                                var inputDown = inputs.byName(inputDownName);
                                this.inputRemove(inputDown);
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
                            var inputToAdd = inputs.byName(gamepadIDMove + directionName);
                            this.inputAdd(inputToAdd);
                        }
                    } // end for
                    var gamepadIDButton = gamepadID + "Button";
                    var areButtonsPressed = gamepad.buttonsPressed;
                    for (var b = 0; b < areButtonsPressed.length; b++) {
                        var isButtonPressed = areButtonsPressed[b];
                        var inputName = gamepadIDButton + b;
                        var input = inputs.byName(inputName);
                        if (isButtonPressed) {
                            this.inputAdd(input);
                        }
                        else {
                            this.inputRemove(input);
                        }
                    }
                }
            }
            // events
            // events - keyboard
            handleEventKeyDown(event) {
                var inputSymbol = event.key;
                if (this.keysToPreventDefaultsFor.indexOf(inputSymbol) >= 0) {
                    event.preventDefault();
                }
                var inputPressed = GameFramework.Input.bySymbol(inputSymbol);
                if (inputPressed != null) {
                    this.inputAdd(inputPressed);
                }
            }
            handleEventKeyUp(event) {
                var inputReleased = GameFramework.Input.bySymbol(event.key);
                if (inputReleased != null) {
                    this.inputRemove(inputReleased);
                }
            }
            // events - mouse
            handleEventMouseDown(event) {
                var canvas = event.target;
                var canvasBox = canvas.getBoundingClientRect();
                this.mouseClickPos.overwriteWithDimensions(event.clientX - canvasBox.left, event.clientY - canvasBox.top, 0);
                this.inputAdd(GameFramework.Input.Instances().MouseClick);
            }
            handleEventMouseMove(event) {
                var canvas = event.target;
                var canvasBox = canvas.getBoundingClientRect();
                this.mouseMovePosNext.overwriteWithDimensions(event.clientX - canvasBox.left, event.clientY - canvasBox.top, 0);
                if (this.mouseMovePosNext.equals(this.mouseMovePos) == false) {
                    this.mouseMovePosPrev.overwriteWith(this.mouseMovePos);
                    this.mouseMovePos.overwriteWith(this.mouseMovePosNext);
                    this.inputAdd(GameFramework.Input.Instances().MouseMove);
                }
            }
            handleEventMouseUp(event) {
                this.inputRemove(GameFramework.Input.Instances().MouseClick);
            }
            handleEventMouseWheel(event) {
                if (this.isMouseWheelTracked) {
                    var wheelMovementAmountInPixels = event.deltaY; // Seems a strange unit.
                    var inputs = GameFramework.Input.Instances();
                    var inputToAdd = wheelMovementAmountInPixels > 0
                        ? inputs.MouseWheelDown
                        : inputs.MouseWheelUp;
                    this.inputAdd(inputToAdd);
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
                    this.inputAdd(GameFramework.Input.Instances().MouseClick);
                }
            }
            handleEventTouchEnd(event) {
                this.inputRemove(GameFramework.Input.Instances().MouseClick);
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
                    this.isMouseMovementTracked
                        ? this.handleEventMouseMove.bind(this)
                        : null;
                divMain.onwheel =
                    this.handleEventMouseWheel.bind(this);
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
