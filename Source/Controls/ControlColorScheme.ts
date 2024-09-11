
namespace ThisCouldBeBetter.GameFramework
{

export class ControlColorScheme
{
	name: string;
	colorBackground: Color;
	colorFill: Color;
	colorBorder: Color;
	colorDisabled: Color;

	constructor
	(
		name: string,
		colorBackground: Color,
		colorFill: Color,
		colorBorder: Color,
		colorDisabled: Color,
	)
	{
		this.name = name;
		this.colorBackground = colorBackground;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
		this.colorDisabled = colorDisabled;
	}

	static _instances: ControlColorScheme_Instances;
	static Instances(): ControlColorScheme_Instances
	{
		if (ControlColorScheme._instances == null)
		{
			ControlColorScheme._instances = new ControlColorScheme_Instances();
		}
		return ControlColorScheme._instances;
	}

	static byName(colorSchemeName: string): ControlColorScheme
	{
		return ControlColorScheme.Instances()._AllByName.get(colorSchemeName);
	}

	clone(): ControlColorScheme
	{
		return new ControlColorScheme
		(
			this.name,
			this.colorBackground,
			this.colorFill,
			this.colorBorder,
			this.colorDisabled
		);
	}
}

export class ControlColorScheme_Instances
{
	Default: ControlColorScheme;
	Dark: ControlColorScheme;

	_All: ControlColorScheme[];
	_AllByName: Map<string, ControlColorScheme>;

	constructor()
	{
		var colors = Color.Instances();

		this.Default = new ControlColorScheme
		(
			"Default", // name
			Color.fromRGB(240/255, 240/255, 240/255), // colorBackground
			colors.White, // colorFill
			colors.Gray, // colorBorder
			colors.GrayLight // colorDisabled
		);

		this.Dark = new ControlColorScheme
		(
			"Dark", // name
			colors.GrayDark, // colorBackground
			colors.Black, // colorFill
			colors.White, // colorBorder
			colors.GrayLight // colorDisabled
		);

		this._All =
		[
			this.Default, this.Dark
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}

}
