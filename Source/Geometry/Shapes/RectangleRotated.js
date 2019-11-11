
function RectangleRotated(bounds, angleInTurns)
{
	this.bounds = bounds;
	this.angleInTurns = angleInTurns;
}
{
	RectangleRotated.prototype.coordsGroupToTranslate = function()
	{
		return [ this.bounds.center ];
	}

	// cloneable

	RectangleRotated.prototype.clone = function()
	{
		return new RectangleRotated(this.bounds.clone(), this.angleInTurns);
	}

	RectangleRotated.prototype.overwriteWith = function(other)
	{
		this.bounds.overwriteWith(other.bounds);
		this.angleInTurns = other.angleInTurns;
		return this;
	}
}
