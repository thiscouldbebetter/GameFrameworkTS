
class Color
{
	name: string;
	code: string;
	componentsRGBA: number[];

	_systemColor: string;

	constructor(name: string, code: string, componentsRGBA: number[])
	{
		this.name = name;
		this.code = code;
		this.componentsRGBA = componentsRGBA;
	}

	// constants

	static NumberOfComponentsRGBA = 4;

	// instances

	static _instances: Color_Instances;

	static Instances()
	{
		if (Color._instances == null)
		{
			Color._instances = new Color_Instances();
		}

		return Color._instances;
	};

	// methods

	alpha()
	{
		return this.componentsRGBA[3];
	};

	alphaSet(valueToSet: number)
	{
		if (valueToSet != null)
		{
			this.componentsRGBA[3] = valueToSet;
			this._systemColor = null;
		}
		return this;
	};

	clone()
	{
		return new Color(this.name, this.code, this.componentsRGBA.slice());
	};

	systemColor()
	{
		if (this._systemColor == null)
		{
			this._systemColor =
				"rgba("
				+ Math.floor(255 * this.componentsRGBA[0]) + ", "
				+ Math.floor(255 * this.componentsRGBA[1]) + ", "
				+ Math.floor(255 * this.componentsRGBA[2]) + ", "
				+ this.componentsRGBA[3]
				+ ")";
		}

		return this._systemColor;
	};
}

class Color_Instances
{
	_Transparent: Color;
	Black: Color;
	Blue: Color;
	BlueDark: Color;
	Brown: Color;
	Cyan: Color;
	Gray: Color;
	GrayDark: Color;
	GrayLight: Color;
	Green: Color;
	GreenDark: Color;
	Orange: Color;
	Red: Color;
	RedDark: Color;
	Violet: Color;
	White: Color;
	Yellow: Color;
	YellowDark: Color;

	_All: Color[];
	_AllByCode: Map<string, Color>;

	constructor()
	{
		this._Transparent = new Color("Transparent", ".", [0, 0, 0, 0] );

		this.Black = new Color("Black", "k", [0, 0, 0, 1] );
		this.Blue = new Color("Blue", "b", [0, 0, 1, 1] );
		this.BlueDark = new Color("BlueDark", "B", [0, 0, .5, 1] );
		this.Brown = new Color("Brown", "O", [0.5, 0.25, 0, 1] );
		this.Cyan = new Color("Cyan", "c", [0, 1, 1, 1] );
		this.Gray = new Color("Gray", "a", [0.5, 0.5, 0.5, 1] );
		this.GrayDark = new Color("GrayDark", "A", [0.25, 0.25, 0.25, 1] );
		this.GrayLight = new Color("GrayLight","@", [0.75, 0.75, 0.75, 1] );
		this.Green = new Color("Green",	"g", [0, 1, 0, 1] );
		this.GreenDark = new Color("GreenDark", "G", [0, .5, 0, 1] );
		this.Orange = new Color("Orange", "o", [1, 0.5, 0, 1] );
		this.Red = new Color("Red", "r", [1, 0, 0, 1] );
		this.RedDark = new Color("RedDark", "R", [.5, 0, 0, 1] );
		this.Violet = new Color("Violet", "v", [1, 0, 1, 1] );
		this.White = new Color("White", "w", [1, 1, 1, 1] );
		this.Yellow = new Color("Yellow", "y", [1, 1, 0, 1] );
		this.YellowDark = new Color("Yellow", "Y", [.5, .5, 0, 1] );

		this._All =
		[
			this._Transparent,

			this.Black,
			this.Blue,
			this.BlueDark,
			this.Brown,
			this.Cyan,
			this.Gray,
			this.GrayDark,
			this.GrayLight,
			this.Green,
			this.GreenDark,
			this.Orange,
			this.Red,
			this.RedDark,
			this.Violet,
			this.White,
			this.Yellow,
			this.YellowDark,
		];

		this._AllByCode = ArrayHelper.addLookups(this._All, (x: Color) => x.code);
	}
}
