
namespace ThisCouldBeBetter.GameFramework
{

export class Color implements Interpolatable<Color>
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

	static byName(colorName: string): Color
	{
		return Color.Instances()._AllByName.get(colorName);
	}

	static create(): Color
	{
		return Color.fromRGB(0, 0, 0); // Black.
	}

	static default(): Color
	{
		return Color.create();
	}

	static fromRGB(red: number, green: number, blue: number): Color
	{
		return new Color(null, null, [red, green, blue, 1]);
	}

	static fromSystemColor(systemColor: string): Color
	{
		var returnValue = new Color(systemColor, null, null);
		returnValue._systemColor = systemColor;
		return returnValue;
	}

	static grayWithValue(value: number): Color
	{
		return Color.fromRGB(value, value, value);
	}

	static systemColorGet(color: Color): string
	{
		return (color == null ? null : color.systemColor() );
	}

	// constants

	static NumberOfComponentsRGBA = 4;

	// instances

	static _instances: Color_Instances;

	static Instances(): Color_Instances
	{
		if (Color._instances == null)
		{
			Color._instances = new Color_Instances();
		}

		return Color._instances;
	}

	// methods

	add(other: Color): Color
	{
		return this.interpolateWith(other, .5);
	}

	alpha(): number
	{
		return this.componentsRGBA[3];
	}

	alphaSet(valueToSet: number): Color
	{
		this.componentsRGBA[3] = valueToSet;
		this._systemColor = null;

		return this;
	}

	componentsRGB(): number[]
	{
		return this.componentsRGBA.slice(0, 3);
	}

	darken(): Color
	{
		return this.multiplyRGBScalar(.5);
	}

	isBlack(): boolean
	{
		return (this.componentsRGB().some(x => x > 0) == false);
	}

	isTransparent(): boolean
	{
		return (this.alpha() < 1);
	}

	isWhite(): boolean
	{
		return (this.componentsRGB().some(x => x < 1) == false);
	}

	lighten(): Color
	{
		return this.multiplyRGBScalar(2);
	}

	multiplyRGBScalar(scalar: number): Color
	{
		for (var i = 0; i < 3; i++)
		{
			this.componentsRGBA[i] *= scalar;
			if (this.componentsRGBA[i] > 1)
			{
				this.componentsRGBA[i] = 1;
			}
		}
		return this;
	}

	systemColor(): string
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
	}

	value(): number
	{
		// This is "value" as in how dark or light the color is.
		var returnValue =
		(
			this.componentsRGBA[0]
			+ this.componentsRGBA[1]
			+ this.componentsRGBA[2]
		) / 3;

		return returnValue;
	}

	valueMultiplyByScalar(scalar: number): Color
	{
		// This is "value" as in how dark or light the color is.

		for (var i = 0; i < 3; i++)
		{
			var component = this.componentsRGBA[i];
			component = Math.round(component * scalar);
			if (component > 1)
			{
				component = 1;
			}
			this.componentsRGBA[i] = component;
		}

		return this;
	}

	// Clonable.

	clone(): Color
	{
		return new Color(this.name, this.code, this.componentsRGBA.slice());
	}

	overwriteWith(other: Color): Color
	{
		this.name = other.name;
		this.code = other.code;
		ArrayHelper.overwriteWithNonClonables
		(
			this.componentsRGBA, other.componentsRGBA
		);
		this._systemColor = null;
		return this;
	}

	overwriteWithComponentsRGBA255
	(
		otherAsComponentsRGBA255: Uint8ClampedArray
	): Color
	{
		this.componentsRGBA[0] = otherAsComponentsRGBA255[0] / 255;
		this.componentsRGBA[1] = otherAsComponentsRGBA255[1] / 255;
		this.componentsRGBA[2] = otherAsComponentsRGBA255[2] / 255;
		this.componentsRGBA[3] = otherAsComponentsRGBA255[3] / 255; // Alpha is integer <= 255 in this case.

		return this;
	}

	// Interpolatable.

	interpolateWith(other: Color, fractionOfProgressTowardOther: number): Color
	{
		var fractionOfProgressTowardOtherReversed =
			1 - fractionOfProgressTowardOther;
		var componentsRGBAThis = this.componentsRGBA;
		var componentsRGBAOther = other.componentsRGBA;
		var componentsRGBAInterpolated = new Array<number>();
		for (var i = 0; i < componentsRGBAThis.length; i++)
		{
			var componentThis = componentsRGBAThis[i];
			var componentOther = componentsRGBAOther[i];
			var componentInterpolated =
				componentThis * fractionOfProgressTowardOtherReversed
				+ componentOther * fractionOfProgressTowardOther;
			componentsRGBAInterpolated[i] = componentInterpolated;

			componentsRGBAThis[i] = componentInterpolated;
		}

		return this;
	}
}

export class Color_Instances
{
	_Transparent: Color;
	Black: Color;
	BlackHalfTransparent: Color;
	Blue: Color;
	BlueDark: Color;
	BlueLight: Color;
	Brown: Color;
	Cyan: Color;
	Gold: Color;
	Gray: Color;
	GrayDark: Color;
	GrayDarker: Color
	GrayLight: Color;
	GrayLighter: Color;
	Green: Color;
	GreenDark: Color;
	GreenDarker: Color;
	GreenLight: Color;
	GreenMediumDark: Color;
	GreenMediumLight: Color;
	Orange: Color;
	Pink: Color;
	Red: Color;
	RedDark: Color;
	Tan: Color;
	Violet: Color;
	VioletDark: Color;
	VioletEighth: Color;
	VioletQuarter: Color;
	White: Color;
	Yellow: Color;
	YellowDark: Color;

	_All: Color[];
	_AllByCode: Map<string, Color>;
	_AllByName: Map<string, Color>;

	constructor()
	{
		this._Transparent = new Color("Transparent", ".", [0, 0, 0, 0] );

		this.Black = new Color("Black", "k", [0, 0, 0, 1] );
		this.BlackHalfTransparent = new Color("BlackHalfTransparent", "K", [0, 0, 0, .5] );
		this.Blue = new Color("Blue", "b", [0, 0, 1, 1] );
		this.BlueDark = new Color("BlueDark", "B", [0, 0, .5, 1] );
		this.BlueLight = new Color("BlueLight", "$", [.5, .5, 1, 1] );
		this.Brown = new Color("Brown", "O", [0.5, 0.25, 0, 1] );
		this.Cyan = new Color("Cyan", "c", [0, 1, 1, 1] );
		this.Gold = new Color("Gold", null, [.5, .5, 0, 1] );
		this.Gray = new Color("Gray", "a", [0.5, 0.5, 0.5, 1] );
		this.GrayDark = new Color("GrayDark", "A", [0.25, 0.25, 0.25, 1] );
		this.GrayDarker = new Color("GrayDarker", "#", [0.125, 0.125, 0.125, 1] );
		this.GrayLight = new Color("GrayLight","@", [0.75, 0.75, 0.75, 1] );
		this.GrayLighter = new Color("GrayLighter","-", [0.825, 0.825, 0.825, 1] );
		this.Green = new Color("Green",	"g", [0, 1, 0, 1] );
		this.GreenDark = new Color("GreenDark", "G", [0, .5, 0, 1] );
		this.GreenDarker = new Color("GreenDarker", "", [0, .25, 0, 1] );
		this.GreenLight = new Color("GreenLight", "%", [.5, 1, .5, 1] );
		this.GreenMediumDark = new Color("GreenMediumDark", "", [0, .75, 0, 1] );
		this.GreenMediumLight = new Color("GreenMediumLight", "", [.25, 1, .25, 1] );
		this.Orange = new Color("Orange", "o", [1, 0.5, 0, 1] );
		this.Pink = new Color("Pink", "p", [1, 0.5, 0.5, 1] );
		this.Red = new Color("Red", "r", [1, 0, 0, 1] );
		this.RedDark = new Color("RedDark", "R", [.5, 0, 0, 1] );
		this.Tan = new Color("Tan", "T", [.8, .7, .5, 1] );
		this.Violet = new Color("Violet", "v", [1, 0, 1, 1] );
		this.VioletDark = new Color("VioletDark", "V2", [.5, 0, .5, 1] );
		this.VioletEighth = new Color("VioletEighth", "V8", [.125, 0, .125, 1] );
		this.VioletQuarter = new Color("VioletQuarter", "V4", [.25, 0, .25, 1] );
		this.White = new Color("White", "w", [1, 1, 1, 1] );
		this.Yellow = new Color("Yellow", "y", [1, 1, 0, 1] );
		this.YellowDark = new Color("YellowDark", "Y", [.5, .5, 0, 1] );

		this._All =
		[
			this._Transparent,

			this.Black,
			this.BlackHalfTransparent,
			this.Blue,
			this.BlueDark,
			this.BlueLight,
			this.Brown,
			this.Cyan,
			this.Gold,
			this.Gray,
			this.GrayDark,
			this.GrayDarker,
			this.GrayLight,
			this.GrayLighter,
			this.Green,
			this.GreenDark,
			this.GreenDarker,
			this.GreenLight,
			this.GreenMediumDark,
			this.GreenMediumLight,
			this.Orange,
			this.Pink,
			this.Red,
			this.RedDark,
			this.Tan,
			this.Violet,
			this.VioletDark,
			this.VioletEighth,
			this.VioletQuarter,
			this.White,
			this.Yellow,
			this.YellowDark,
		];

		this._AllByCode = ArrayHelper.addLookups(this._All, (x: Color) => x.code);
		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}

}
