
function Bounds(center, size)
{
	this.center = center;
	this.size = size;

	this.sizeHalf = this.size.clone().divideScalar(2);
	this._min = new Coords();
	this._max = new Coords();
}
{
	Bounds.prototype.containsOther = function(other)
	{
		return ( this.containsPoint(other.min()) && this.containsPoint(other.max()) );
	}
	
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
 
		var extremaThisAndOther = 
		[ 
			[ this.min().dimensions(), this.max().dimensions() ],
			[ other.min().dimensions(), other.max().dimensions() ]
		];
 
		for (var b = 0; b < extremaThisAndOther.length; b++)
		{
			var extremaThis = extremaThisAndOther[b];
			var extremaOther = extremaThisAndOther[1 - b];

			var minThisDimensions = extremaThis[0];
			var maxThisDimensions = extremaThis[1];

			var minOtherDimensions = extremaOther[0];
			var maxOtherDimensions = extremaOther[1];
 
			var doAllDimensionsOverlapSoFar = true;
 
			for (var d = 0; d < minThisDimensions.length; d++)
			{
				if 
				(
					maxThisDimensions[d] <= minOtherDimensions[d]
					|| minThisDimensions[d] >= maxOtherDimensions[d]
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
