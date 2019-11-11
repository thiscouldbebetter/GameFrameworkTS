
function RectangleRotated(center, size, angleInTurns)
{
	this.center = center;
	this.size = size;
	this.angleInTurns = angleInTurns;
}
{
	RectangleRotated.prototype.coordsGroupToTranslate = function()
	{
		return [ this.center ];
	}

	// cloneable

	RectangleRotated.prototype.clone = function()
	{
		return new RectangleRotated(this.center.clone(), this.size.clone(), this.angleInTurns);
	}

	RectangleRotated.prototype.overwriteWith = function(other)
	{
		this.center.overwriteWith(other.center);
		this.size.overwriteWith(other.size);
		this.angleInTurns = other.angleInTurns;
		return this;
	}
}
