
class ShapeGroupAll
{
	constructor(shapes)
	{
		this.shapes = shapes;
	}

	clone()
	{
		return new ShapeGroupAll(this.shapes.clone());
	};

	overwriteWith(other)
	{
		this.shapes.overwriteWith(other.shapes);
		return this;
	};
}
