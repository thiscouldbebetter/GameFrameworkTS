"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Input {
            constructor(name) {
                this.name = name;
                this.isActive = true;
                this.ticksActive = 0;
            }
            static Names() {
                if (Input._names == null) {
                    Input._names = new Input_Names();
                }
                return Input._names;
            }
        }
        GameFramework.Input = Input;
        class Input_Names {
            constructor() {
                this.ArrowDown = "ArrowDown";
                this.ArrowLeft = "ArrowLeft";
                this.ArrowRight = "ArrowRight";
                this.ArrowUp = "ArrowUp";
                this.Backspace = "Backspace";
                this.Control = "Control";
                this.Enter = "Enter";
                this.Escape = "Escape";
                this.F5 = "F5";
                this.GamepadButton0 = "GamepadButton0_";
                this.GamepadButton1 = "GamepadButton1_";
                this.GamepadMoveDown = "GamepadMoveDown_";
                this.GamepadMoveLeft = "GamepadMoveLeft_";
                this.GamepadMoveRight = "GamepadMoveRight_";
                this.GamepadMoveUp = "GamepadMoveUp_";
                this.MouseClick = "MouseClick";
                this.MouseMove = "MouseMove";
                this.MouseWheelDown = "MouseWheelDown";
                this.MouseWheelUp = "MouseWheelUp";
                this.Shift = "Shift";
                this.Space = "_";
                this.Tab = "Tab";
                this._All =
                    [
                        this.ArrowDown,
                        this.ArrowLeft,
                        this.ArrowRight,
                        this.ArrowUp,
                        this.Backspace,
                        this.Control,
                        this.Enter,
                        this.Escape,
                        this.F5,
                        this.GamepadButton0,
                        this.GamepadButton1,
                        this.GamepadMoveDown,
                        this.GamepadMoveLeft,
                        this.GamepadMoveRight,
                        this.GamepadMoveUp,
                        this.MouseClick,
                        this.MouseMove,
                        this.Shift,
                        this.Space,
                        this.Tab
                    ];
                this._AllByName = GameFramework.ArrayHelper.addLookups(this._All, (x) => x);
            }
        }
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
