
function Path(points)
{
	this.points = points;
}
{
	Path.prototype.clone = function()
	{
		return new Path(this.points.clone());
	}

	Path.prototype.overwriteWith = function(other)
	{
		this.points.overwriteWith(other.points);
		return this;
	}

	Path.prototype.transform = function(transformToApply)
	{
		Transform.applyTransformToCoordsMany(transformToApply, this.points);
		return this;
	}
}
