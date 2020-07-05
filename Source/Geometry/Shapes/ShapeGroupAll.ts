
class ShapeGroupAll
{
	shapes: any[];

	constructor(shapes)
	{
		this.shapes = shapes;
	}

	clone()
	{
		return new ShapeGroupAll(ArrayHelper.clone(this.shapes));
	};

	overwriteWith(other)
	{
		ArrayHelper.overwriteWith(this.shapes, other.shapes);
		return this;
	};
}
