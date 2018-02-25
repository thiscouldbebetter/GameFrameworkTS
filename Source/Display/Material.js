
function Material(name, colorStroke, colorFill, texture)
{
	this.name = name;
	this.colorStroke = colorStroke;
	this.colorFill = colorFill;
	this.texture = texture;
}

{
	function Material_Instances()
	{
		if (Material.Instances == null)
		{
			Material.Instances = this;
		}

		this.Default = new Material
		(
			"Default",
			Color.Instances.Blue, // colorStroke
			Color.Instances.Yellow, // colorFill
			null // texture
		);
	}

	Material.Instances = new Material_Instances();
}
