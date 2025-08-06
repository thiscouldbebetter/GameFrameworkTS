
namespace ThisCouldBeBetter.GameFramework
{

export class Input
{
	name: string;
	symbol: string;

	isActive: boolean;
	ticksActive: number;

	constructor
	(
		name: string,
		symbol: string
	)
	{
		this.name = name;
		this.symbol = symbol;

		this.isActive = true;
		this.ticksActive = 0;
	}

	static fromNameAndSymbol
	(
		name: string,
		symbol: string
	): Input
	{
		return new Input(name, symbol);
	}

	static _instances: Input_Instances;
	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new Input_Instances();
		}

		return this._instances;
	}

	static byName(name: string): Input
	{
		return this.Instances().byName(name);
	}

	static bySymbol(symbol: string): Input
	{
		return this.Instances().bySymbol(symbol);
	}

}

class Input_Instances
{
	_0: Input;
	_1: Input;
	_2: Input;
	_3: Input;
	_4: Input;
	_5: Input;
	_6: Input;
	_7: Input;
	_8: Input;
	_9: Input;
	a: Input;
	b: Input;
	c: Input;
	d: Input;
	e: Input;
	f: Input;
	g: Input;
	h: Input;
	i: Input;
	j: Input;
	k: Input;
	l: Input;
	m: Input;
	n: Input;
	o: Input;
	p: Input;
	q: Input;
	r: Input;
	s: Input;
	t: Input;
	u: Input;
	v: Input;
	w: Input;
	x: Input;
	y: Input;
	z: Input;
	A: Input;
	B: Input;
	C: Input;
	D: Input;
	E: Input;
	F: Input;
	G: Input;
	H: Input;
	I: Input;
	J: Input;
	K: Input;
	L: Input;
	M: Input;
	N: Input;
	O: Input;
	P: Input;
	Q: Input;
	R: Input;
	S: Input;
	T: Input;
	U: Input;
	V: Input;
	W: Input;
	X: Input;
	Y: Input;
	Z: Input;
	ArrowDown: Input;
	ArrowLeft: Input;
	ArrowRight: Input;
	ArrowUp: Input;
	Backspace: Input;
	Control: Input;
	Enter: Input;
	Escape: Input;
	F5: Input;
	GamepadButton0: Input;
	GamepadButton1: Input;
	GamepadMoveDown: Input;
	GamepadMoveLeft: Input;
	GamepadMoveRight: Input;
	GamepadMoveUp: Input;
	MouseClick: Input;
	MouseMove: Input;
	MouseWheelDown: Input;
	MouseWheelUp: Input;
	Shift: Input;
	Space: Input;
	Tab: Input;
	Tilde: Input;

	_All: Input[];
	_AllByName: Map<string, Input>;
	_AllBySymbol: Map<string, Input>;

	constructor()
	{
		var i = (n: string) => Input.fromNameAndSymbol(n, n);
		var i2 = (n: string, s: string) => Input.fromNameAndSymbol(n, s);

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
			new Map(this._All.map(x => [x.name, x] ) );
		this._AllBySymbol =
			new Map(this._All.map(x => [x.symbol, x] ) );
	}

	byName(name: string): Input
	{
		return this._AllByName.get(name);
	}

	bySymbol(symbol: string): Input
	{
		return this._AllBySymbol.get(symbol);
	}

}

}
