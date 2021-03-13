
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Colorize implements Transform
{
	colorFill: Color;
	colorBorder: Color;

	constructor(colorFill: Color, colorBorder: Color)
	{
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	overwriteWith(other: Transform)
	{
		return this; // todo
	}

	transform(transformable: Transformable): Transformable
	{
		var transformableAsAny: any = transformable;
		if (transformableAsAny.colorFill == null)
		{
			transformable.transform(this);
		}
		else
		{
			var transformableAsColorable = transformableAsAny as Colorable;
			var colorFill = transformableAsColorable.colorFill;
			var colorBorder = transformableAsColorable.colorBorder;

			if (colorFill != null && this.colorFill != null)
			{
				colorFill.overwriteWith(this.colorFill);
			}
			if (colorBorder != null && this.colorBorder != null)
			{
				colorBorder.overwriteWith(this.colorBorder);
			}
		}

		return transformable;
	}

	transformCoords(coordsToTransform: Coords)
	{
		return coordsToTransform; // todo
	}

}

}
