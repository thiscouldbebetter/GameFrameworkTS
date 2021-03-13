
namespace ThisCouldBeBetter.GameFramework
{

export class Path
{
	points: Coords[];

	constructor(points: Coords[])
	{
		this.points = points;
	}

	// Clonable.

	clone()
	{
		return new Path(ArrayHelper.clone(this.points) );
	}

	overwriteWith(other: Path)
	{
		ArrayHelper.overwriteWith(this.points, other.points);
		return this;
	}

	// Transformable.

	transform(transformToApply: Transform)
	{
		Transforms.applyTransformToCoordsMany(transformToApply, this.points);
		return this;
	}
}

}
