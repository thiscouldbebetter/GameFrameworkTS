
function ShapeGroupAll(shapes)
{
	this.shapes = shapes;
}
{
	ShapeGroupAll.prototype.clone = function()
	{
		return new ShapeGroupAll(this.shapes.clone());
	};

	ShapeGroupAll.prototype.overwriteWith = function(other)
	{
		this.shapes.overwriteWith(other.shapes);
		return this;
	}
}
