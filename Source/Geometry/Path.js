
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
}
