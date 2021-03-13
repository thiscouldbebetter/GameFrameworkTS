
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeGroupAll
{
	shapes: any[];

	constructor(shapes: any[])
	{
		this.shapes = shapes;
	}

	clone()
	{
		return new ShapeGroupAll(ArrayHelper.clone(this.shapes));
	}

	overwriteWith(other: ShapeGroupAll)
	{
		ArrayHelper.overwriteWith(this.shapes, other.shapes);
		return this;
	}
}

}
