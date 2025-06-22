
namespace ThisCouldBeBetter.GameFramework
{

export class Color implements Interpolatable<Color>
{
	name: string;
	code: string;
	fractionsRgba: number[]; // "Rgba" = "Red Green Blue Alpha".

	_systemColor: string;

	constructor(name: string, code: string, fractionsRgba: number[])
	{
		this.name = name;
		this.code = code;
		this.fractionsRgba = fractionsRgba;
	}

	static byName(colorName: string): Color
	{
		return Color.Instances()._AllByName.get(colorName);
	}

	static create(): Color
	{
		return Color.fromFractionsRgb(0, 0, 0); // Black.
	}

	static default(): Color
	{
		return Color.create();
	}

	static fromFractionsRgb
	(
		red: number, green: number, blue: number
	): Color
	{
		return new Color(null, null, [red, green, blue, 1]);
	}

	static fromFractionsRgba
	(
		red: number, green: number, blue: number, alpha: number
	): Color
	{
		return new Color(null, null, [red, green, blue, alpha]);
	}

	static fromSystemColor(systemColor: string): Color
	{
		var returnValue = new Color(systemColor, null, null);
		returnValue._systemColor = systemColor;
		return returnValue;
	}

	static grayWithValue(valueAsFraction: number): Color
	{
		return Color.fromFractionsRgb
		(
			valueAsFraction, valueAsFraction, valueAsFraction
		);
	}

	static systemColorGet(color: Color): string
	{
		return (color == null ? null : color.systemColor() );
	}

	// constants

	static NumberOfComponentsRgba = 4;

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
		// Alpha is the opacity.
		return this.fractionsRgba[3];
	}

	alphaSet(valueToSet: number): Color
	{
		this.fractionsRgba[3] = valueToSet;
		this._systemColor = null;

		return this;
	}

	fractionsRgb(): number[]
	{
		return this.fractionsRgba.slice(0, 3);
	}

	darken(): Color
	{
		return this.multiplyRGBScalar(.5);
	}

	isBlack(): boolean
	{
		return (this.fractionsRgb().some(x => x > 0) == false);
	}

	isTransparent(): boolean
	{
		return (this.alpha() < 1);
	}

	isWhite(): boolean
	{
		return (this.fractionsRgb().some(x => x < 1) == false);
	}

	lighten(): Color
	{
		return this.multiplyRGBScalar(2);
	}

	multiplyRGBScalar(scalar: number): Color
	{
		for (var i = 0; i < 3; i++)
		{
			this.fractionsRgba[i] *= scalar;
			if (this.fractionsRgba[i] > 1)
			{
				this.fractionsRgba[i] = 1;
			}
		}
		return this;
	}

	systemColor(): string
	{
		if (this._systemColor == null)
		{
			this._systemColor =
				"Rgba("
				+ Math.floor(255 * this.fractionsRgba[0]) + ", "
				+ Math.floor(255 * this.fractionsRgba[1]) + ", "
				+ Math.floor(255 * this.fractionsRgba[2]) + ", "
				+ this.fractionsRgba[3]
				+ ")";
		}

		return this._systemColor;
	}

	value(): number
	{
		// This is "value" as in how dark or light the color is.
		var returnValue =
		(
			this.fractionsRgba[0]
			+ this.fractionsRgba[1]
			+ this.fractionsRgba[2]
		) / 3;

		return returnValue;
	}

	valueMultiplyByScalar(scalar: number): Color
	{
		// This is "value" as in how dark or light the color is.

		for (var i = 0; i < 3; i++)
		{
			var fraction = this.fractionsRgba[i];
			fraction = Math.round(fraction * scalar);
			if (fraction > 1)
			{
				fraction = 1;
			}
			this.fractionsRgba[i] = fraction;
		}

		return this;
	}

	// Clonable.

	clone(): Color
	{
		return new Color
		(
			this.name, this.code, this.fractionsRgba.slice()
		);
	}

	overwriteWith(other: Color): Color
	{
		this.name = other.name;
		this.code = other.code;
		ArrayHelper.overwriteWithNonClonables
		(
			this.fractionsRgba,
			other.fractionsRgba
		);
		this._systemColor = null;
		return this;
	}

	overwriteWithFractionsRgba255
	(
		otherAsFractionsRgba255: Uint8ClampedArray
	): Color
	{
		this.fractionsRgba[0] = otherAsFractionsRgba255[0] / 255;
		this.fractionsRgba[1] = otherAsFractionsRgba255[1] / 255;
		this.fractionsRgba[2] = otherAsFractionsRgba255[2] / 255;
		this.fractionsRgba[3] = otherAsFractionsRgba255[3] / 255; // Alpha is integer <= 255 in this case.

		return this;
	}

	// Interpolatable.

	interpolateWith(other: Color, fractionOfProgressTowardOther: number): Color
	{
		var fractionOfProgressTowardOtherReversed =
			1 - fractionOfProgressTowardOther;
		var fractionsRgbaThis = this.fractionsRgba;
		var fractionsRgbaOther = other.fractionsRgba;
		var fractionsRgbaInterpolated = new Array<number>();
		for (var i = 0; i < fractionsRgbaThis.length; i++)
		{
			var fractionThis = fractionsRgbaThis[i];
			var fractionOther = fractionsRgbaOther[i];
			var fractionInterpolated =
				fractionThis * fractionOfProgressTowardOtherReversed
				+ fractionOther * fractionOfProgressTowardOther;
			fractionsRgbaInterpolated[i] = fractionInterpolated;

			fractionsRgbaThis[i] = fractionInterpolated;
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
	Purple: Color;
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
		var c = (name: string, code: string, componentsRgba: number[]) => new Color(name, code, componentsRgba);

		this._Transparent = c("Transparent", ".", [0, 0, 0, 0] );

		this.Black 					= c("Black", "k", [0, 0, 0, 1] );
		this.BlackHalfTransparent 	= c("BlackHalfTransparent", "K", [0, 0, 0, .5] );
		this.Blue 					= c("Blue", "b", [0, 0, 1, 1] );
		this.BlueDark 				= c("BlueDark", "B", [0, 0, .5, 1] );
		this.BlueLight 				= c("BlueLight", "$", [.5, .5, 1, 1] );
		this.Brown 					= c("Brown", "O", [0.5, 0.25, 0, 1] );
		this.Cyan 					= c("Cyan", "c", [0, 1, 1, 1] );
		this.Gold 					= c("Gold", null, [.5, .5, 0, 1] );
		this.Gray 					= c("Gray", "a", [0.5, 0.5, 0.5, 1] );
		this.GrayDark 				= c("GrayDark", "A", [0.25, 0.25, 0.25, 1] );
		this.GrayDarker 			= c("GrayDarker", "#", [0.125, 0.125, 0.125, 1] );
		this.GrayLight 				= c("GrayLight","@", [0.75, 0.75, 0.75, 1] );
		this.GrayLighter 			= c("GrayLighter","-", [0.825, 0.825, 0.825, 1] );
		this.Green 					= c("Green",	"g", [0, 1, 0, 1] );
		this.GreenDark 				= c("GreenDark", "G", [0, .5, 0, 1] );
		this.GreenDarker 			= c("GreenDarker", "", [0, .25, 0, 1] );
		this.GreenLight 			= c("GreenLight", "%", [.5, 1, .5, 1] );
		this.GreenMediumDark 		= c("GreenMediumDark", "", [0, .75, 0, 1] );
		this.GreenMediumLight 		= c("GreenMediumLight", "", [.25, 1, .25, 1] );
		this.Orange 				= c("Orange", "o", [1, 0.5, 0, 1] );
		this.Pink 					= c("Pink", "p", [1, 0.5, 0.5, 1] );
		this.Purple 				= c("Purple", null, [0.5, 0, 0.5, 1] );
		this.Red 					= c("Red", "r", [1, 0, 0, 1] );
		this.RedDark 				= c("RedDark", "R", [.5, 0, 0, 1] );
		this.Tan 					= c("Tan", "T", [.8, .7, .5, 1] );
		this.Violet 				= c("Violet", "v", [1, 0, 1, 1] );
		this.VioletDark 			= c("VioletDark", "V2", [.5, 0, .5, 1] );
		this.VioletEighth 			= c("VioletEighth", "V8", [.125, 0, .125, 1] );
		this.VioletQuarter 			= c("VioletQuarter", "V4", [.25, 0, .25, 1] );
		this.White 					= c("White", "w", [1, 1, 1, 1] );
		this.Yellow 				= c("Yellow", "y", [1, 1, 0, 1] );
		this.YellowDark 			= c("YellowDark", "Y", [.5, .5, 0, 1] );

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
			this.Purple,
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
