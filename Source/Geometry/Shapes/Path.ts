
class Path
{
	constructor(points)
	{
		this.points = points;
	}

	clone()
	{
		return new Path(this.points.clone());
	};

	overwriteWith(other)
	{
		this.points.overwriteWith(other.points);
		return this;
	};

	transform(transformToApply)
	{
		Transform.applyTransformToCoordsMany(transformToApply, this.points);
		return this;
	};
}
