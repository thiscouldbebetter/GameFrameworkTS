
namespace ThisCouldBeBetter.GameFramework
{

export class Material
{
	name: string;
	colorStroke: Color;
	colorFill: Color;
	texture: Texture;

	constructor
	(
		name: string,
		colorStroke: Color,
		colorFill: Color,
		texture: Texture
	)
	{
		this.name = name;
		this.colorStroke = colorStroke;
		this.colorFill = colorFill;
		this.texture = texture;
	}

	static fromNameColorsStrokeAndFillAndTexture
	(
		name: string,
		colorStroke: Color,
		colorFill: Color,
		texture: Texture
	): Material
	{
		return new Material(name, colorStroke, colorFill, texture);
	}
	
	static fromTexture(texture: Texture): Material
	{
		var colors = Color.Instances();

		return new Material
		(
			texture.name,
			colors.Black,
			colors.Gray,
			texture
		);
	}

	static _instances: Material_Instances;
	static Instances()
	{
		if (Material._instances == null)
		{
			Material._instances = new Material_Instances();
		}

		return Material._instances;
	}
}

export class Material_Instances
{
	Default: Material;

	constructor()
	{
		this.Default = new Material
		(
			"Default",
			Color.Instances().Blue, // colorStroke
			Color.Instances().Yellow, // colorFill
			null // texture
		);
	}
}

}
