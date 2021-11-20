
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Colorize implements Transform<Transform_Colorize>
{
	colorFill: Color;
	colorBorder: Color;

	constructor(colorFill: Color, colorBorder: Color)
	{
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	clone(): Transform_Colorize { return this; } // todo

	overwriteWith(other: Transform_Colorize): Transform_Colorize
	{
		return this; // todo
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		var transformableAsColorable = transformable as Transformable_Colorable;
		if (transformableAsColorable == null)
		{
			transformable.transform(this);
		}
		else
		{
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
