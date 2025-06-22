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
                this._0 = "0";
                this._1 = "1";
                this._2 = "2";
                this._3 = "3";
                this._4 = "4";
                this._5 = "5";
                this._6 = "6";
                this._7 = "7";
                this._8 = "8";
                this._9 = "9";
                this.a = "a";
                this.b = "b";
                this.c = "c";
                this.d = "d";
                this.e = "e";
                this.f = "f";
                this.g = "g";
                this.h = "h";
                this.i = "i";
                this.j = "j";
                this.k = "k";
                this.l = "l";
                this.m = "m";
                this.n = "n";
                this.o = "o";
                this.p = "p";
                this.q = "q";
                this.r = "r";
                this.s = "s";
                this.t = "t";
                this.u = "u";
                this.v = "v";
                this.w = "w";
                this.x = "x";
                this.y = "y";
                this.z = "z";
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
                this.Space = "Space";
                this.Tab = "Tab";
                this._All =
                    [
                        this._0,
                        this._1,
                        this._2,
                        this._3,
                        this._4,
                        this._5,
                        this._6,
                        this._7,
                        this._8,
                        this._9,
                        this.a,
                        this.b,
                        this.c,
                        this.d,
                        this.e,
                        this.f,
                        this.g,
                        this.h,
                        this.i,
                        this.j,
                        this.k,
                        this.l,
                        this.m,
                        this.n,
                        this.o,
                        this.p,
                        this.q,
                        this.r,
                        this.s,
                        this.t,
                        this.u,
                        this.v,
                        this.w,
                        this.x,
                        this.y,
                        this.z,
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
