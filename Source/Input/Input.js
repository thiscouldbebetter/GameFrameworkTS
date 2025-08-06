"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Input {
            constructor(name, symbol) {
                this.name = name;
                this.symbol = symbol;
                this.isActive = true;
                this.ticksActive = 0;
            }
            static fromNameAndSymbol(name, symbol) {
                return new Input(name, symbol);
            }
            static Instances() {
                if (this._instances == null) {
                    this._instances = new Input_Instances();
                }
                return this._instances;
            }
            static byName(name) {
                return this.Instances().byName(name);
            }
            static bySymbol(symbol) {
                return this.Instances().bySymbol(symbol);
            }
        }
        GameFramework.Input = Input;
        class Input_Instances {
            constructor() {
                var i = (n) => Input.fromNameAndSymbol(n, n);
                var i2 = (n, s) => Input.fromNameAndSymbol(n, s);
                this._0 = i("0");
                this._1 = i("1");
                this._2 = i("2");
                this._3 = i("3");
                this._4 = i("4");
                this._5 = i("5");
                this._6 = i("6");
                this._7 = i("7");
                this._8 = i("8");
                this._9 = i("9");
                this.a = i("a");
                this.b = i("b");
                this.c = i("c");
                this.d = i("d");
                this.e = i("e");
                this.f = i("f");
                this.g = i("g");
                this.h = i("h");
                this.i = i("i");
                this.j = i("j");
                this.k = i("k");
                this.l = i("l");
                this.m = i("m");
                this.n = i("n");
                this.o = i("o");
                this.p = i("p");
                this.q = i("q");
                this.r = i("r");
                this.s = i("s");
                this.t = i("t");
                this.u = i("u");
                this.v = i("v");
                this.w = i("w");
                this.x = i("x");
                this.y = i("y");
                this.z = i("z");
                this.A = i("A");
                this.B = i("B");
                this.C = i("C");
                this.D = i("D");
                this.E = i("E");
                this.F = i("F");
                this.G = i("G");
                this.H = i("H");
                this.I = i("I");
                this.J = i("J");
                this.K = i("K");
                this.L = i("L");
                this.M = i("M");
                this.N = i("N");
                this.O = i("O");
                this.P = i("P");
                this.Q = i("Q");
                this.R = i("R");
                this.S = i("S");
                this.T = i("T");
                this.U = i("U");
                this.V = i("V");
                this.W = i("W");
                this.X = i("X");
                this.Y = i("Y");
                this.Z = i("Z");
                this.ArrowDown = i("ArrowDown");
                this.ArrowLeft = i("ArrowLeft");
                this.ArrowRight = i("ArrowRight");
                this.ArrowUp = i("ArrowUp");
                this.Backspace = i("Backspace");
                this.Control = i("Control");
                this.Enter = i("Enter");
                this.Escape = i("Escape");
                this.F5 = i("F5");
                this.GamepadButton0 = i("GamepadButton0_");
                this.GamepadButton1 = i("GamepadButton1_");
                this.GamepadMoveDown = i("GamepadMoveDown_");
                this.GamepadMoveLeft = i("GamepadMoveLeft_");
                this.GamepadMoveRight = i("GamepadMoveRight_");
                this.GamepadMoveUp = i("GamepadMoveUp_");
                this.MouseClick = i("MouseClick");
                this.MouseMove = i("MouseMove");
                this.MouseWheelDown = i("MouseWheelDown");
                this.MouseWheelUp = i("MouseWheelUp");
                this.Shift = i("Shift");
                this.Space = i2("Space", " ");
                this.Tab = i("Tab");
                this.Tilde = i2("Tilde", "~");
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
                        this.A,
                        this.B,
                        this.C,
                        this.D,
                        this.E,
                        this.F,
                        this.G,
                        this.H,
                        this.I,
                        this.J,
                        this.K,
                        this.L,
                        this.M,
                        this.N,
                        this.O,
                        this.P,
                        this.Q,
                        this.R,
                        this.S,
                        this.T,
                        this.U,
                        this.V,
                        this.W,
                        this.X,
                        this.Y,
                        this.Z,
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
                        this.Tab,
                        this.Tilde
                    ];
                this._AllByName =
                    new Map(this._All.map(x => [x.name, x]));
                this._AllBySymbol =
                    new Map(this._All.map(x => [x.symbol, x]));
            }
            byName(name) {
                return this._AllByName.get(name);
            }
            bySymbol(symbol) {
                return this._AllBySymbol.get(symbol);
            }
        }
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
