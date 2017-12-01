
function Bounds(center, size)
{
	this.center = center;
	this.size = size;

	this.sizeHalf = this.size.clone().half();
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

	Bounds.prototype.ofPoints = function(points)
	{
		var point0 = points[0];
		var minSoFar = this._min.overwriteWith(point0);
		var maxSoFar = this._max.overwriteWith(point0);

		for (var i = 1; i < points.length; i++)
		{
			var point = points[i];

			if (point.x < minSoFar.x)
			{
				minSoFar.x = point.x;
			}
			else if (point.x > maxSoFar.x)
			{
				maxSoFar.x = point.x;
			}

			if (point.y < minSoFar.y)
			{
				minSoFar.y = point.y;
			}
			else if (point.y > maxSoFar.y)
			{
				maxSoFar.y = point.y;
			}

			if (point.z < minSoFar.z)
			{
				minSoFar.z = point.z;
			}
			else if (point.z > maxSoFar.z)
			{
				maxSoFar.z = point.z;
			}
		}

		this.center.overwriteWith(minSoFar).add(maxSoFar).half();
		this.size.overwriteWith(maxSoFar).subtract(minSoFar);
		this.sizeHalf.overwriteWith(this.size).half();

		return this;
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

	Bounds.prototype.trimCoords = function(coordsToTrim)
	{
		return coordsToTrim.trimToRangeMinMax(this.min(), this.max());
	}
}
