
class ControlStyle
{
	constructor(name, colorBackground, colorFill, colorBorder, colorDisabled)
	{
		this.name = name;
		this.colorBackground = colorBackground;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
		this.colorDisabled = colorDisabled;
	}
}
{
	ControlStyle.Instances = function()
	{
		if (ControlStyle._Instances == null)
		{
			ControlStyle._Instances = new ControlStyle_Instances();
		}
		return ControlStyle._Instances;
	};

	function ControlStyle_Instances()
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
