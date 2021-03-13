
namespace ThisCouldBeBetter.GameFramework
{

export class ControlStyle
{
	name: string;
	colorBackground: Color;
	colorFill: Color;
	colorBorder: Color;
	colorDisabled: Color;

	constructor(name: string, colorBackground: Color, colorFill: Color, colorBorder: Color, colorDisabled: Color)
	{
		this.name = name;
		this.colorBackground = colorBackground;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
		this.colorDisabled = colorDisabled;
	}

	static _instances: ControlStyle_Instances;
	static Instances()
	{
		if (ControlStyle._instances == null)
		{
			ControlStyle._instances = new ControlStyle_Instances();
		}
		return ControlStyle._instances;
	}

	static byName(styleName: string)
	{
		return ControlStyle.Instances()._AllByName.get(styleName);
	}
}

export class ControlStyle_Instances
{
	Default: ControlStyle;
	Dark: ControlStyle;

	_All: ControlStyle[];
	_AllByName: Map<string, ControlStyle>;

	constructor()
	{
		this.Default = new ControlStyle
		(
			"Default", // name
			Color.fromRGB(240/255, 240/255, 240/255), // colorBackground
			Color.byName("White"), // colorFill
			Color.byName("Gray"), // colorBorder
			Color.byName("GrayLight") // colorDisabled
		);

		this.Dark = new ControlStyle
		(
			"Dark", // name
			Color.byName("GrayDark"), // colorBackground
			Color.byName("Black"), // colorFill
			Color.byName("White"), // colorBorder
			Color.byName("GrayLight") // colorDisabled
		);
		
		this._All = [ this.Default, this.Dark ];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}

}
