
function Material(name, colorStroke, colorFill, texture)
{
	this.name = name;
	this.colorStroke = colorStroke;
	this.colorFill = colorFill;
	this.texture = texture;
}

{
	Material.Instances = function()
	{
		if (Material._Instances == null)
		{
			Material._Instances = this;

			this.Default = new Material
			(
				"Default",
				Color.Instances().Blue, // colorStroke
				Color.Instances().Yellow, // colorFill
				null // texture
			);
		}

		return Material._Instances;
	};
}
