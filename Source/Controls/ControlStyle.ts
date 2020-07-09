
class ControlStyle
{
	name: string;
	colorBackground: string;
	colorFill: string;
	colorBorder: string;
	colorDisabled: string;

	constructor(name: string, colorBackground: string, colorFill: string, colorBorder: string, colorDisabled: string)
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
	};
}

class ControlStyle_Instances
{
	Default: ControlStyle;

	constructor()
	{
		this.Default = new ControlStyle
		(
			"Default", // name
			"rgb(240, 240, 240)", // colorBackground
			"White", // colorFill
			"Gray", // colorBorder
			"LightGray" // colorDisabled
		);
	}
}
