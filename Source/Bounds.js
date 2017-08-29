
function Bounds(center, size)
{
	this.center = center;
	this.size = size;

	this.sizeHalf = this.size.clone().divideScalar(2);
	this._min = new Coords();
	this._max = new Coords();
}
{
	Bounds.prototype.containsPoint = function(pointToCheck)
	{
		return pointToCheck.isInRangeMinMax(this.min(), this.max());
	}

	Bounds.prototype.max = function()
	{
		return this._max.overwriteWith(this.center).add(this.sizeHalf);
	}

	Bounds.prototype.min = function()
	{
		return this._min.overwriteWith(this.center).subtract(this.sizeHalf);
	}

	Bounds.prototype.overlapsWith = function(other)
	{
		var returnValue = false;
 
		var bounds = [ this, other ];
 
		for (var b = 0; b < bounds.length; b++)
		{
			var boundsThis = bounds[b];
			var boundsOther = bounds[1 - b];
 
			var doAllDimensionsOverlapSoFar = true;
 
			for (var d = 0; d < Coords.NumberOfDimensions; d++)
			{
				if 
				(
					boundsThis.max().dimension(d) <= boundsOther.min().dimension(d)
					|| boundsThis.min().dimension(d) >= boundsOther.max().dimension(d)
				)
				{
					doAllDimensionsOverlapSoFar = false;
					break;
				}
			}
 
			if (doAllDimensionsOverlapSoFar == true)
			{
				returnValue = true;
				break;
			}
		}
 
		return returnValue;
	}
}