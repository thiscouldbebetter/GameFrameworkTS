
function ControlStyle(name, colorBackground, colorFill, colorBorder, colorDisabled)
{
	this.name = name;
	this.colorBackground = colorBackground;
	this.colorFill = colorFill;
	this.colorBorder = colorBorder;
	this.colorDisabled = colorDisabled;
}

{
	ControlStyle.Instances = new ControlStyle_Instances();

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
