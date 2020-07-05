
class Path
{
	points: Coords[];

	constructor(points)
	{
		this.points = points;
	}

	clone()
	{
		return new Path(ArrayHelper.clone(this.points) );
	};

	overwriteWith(other)
	{
		ArrayHelper.overwriteWith(this.points, other.points);
		return this;
	};

	transform(transformToApply)
	{
		Transform.applyTransformToCoordsMany(transformToApply, this.points);
		return this;
	};
}
