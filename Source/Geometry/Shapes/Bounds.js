
function Bounds(center, size)
{
	this.center = center;
	this.size = size;

	this.sizeHalf = this.size.clone().half();
	this._min = new Coords();
	this._max = new Coords();
}
{
	// Static methods.

	Bounds.doBoundsInSetsOverlap = function(boundsSet0, boundsSet1)
	{
		var returnValue = false;

		var numberOfBoundsInSet0 = ( boundsSet0 == null ? 0 : boundsSet0.length );
		var numberOfBoundsInSet1 = ( boundsSet1 == null ? 0 : boundsSet1.length );

		for (var i = 0; i < numberOfBoundsInSet0; i++)
		{
			var boundsFromSet0 = boundsSet0[i];

			for (var j = 0; j < numberOfBoundsInSet1; j++)
			{
				var boundsFromSet1 = boundsSet1[j];

				var doBoundsOverlap = boundsFromSet0.overlapsWith
				(
					boundsFromSet1
				);

				if (doBoundsOverlap)
				{
					returnValue = true;
					break;
				}
			}
		}

		return returnValue;
	};

	Bounds.fromMinAndSize = function(min, size)
	{
		var center = size.clone().half().add(min);
		return new Bounds(center, size);
	};

	// Instance methods.

	Bounds.prototype.containsOther = function(other)
	{
		return ( this.containsPoint(other.min()) && this.containsPoint(other.max()) );
	};

	Bounds.prototype.containsPoint = function(pointToCheck)
	{
		return pointToCheck.isInRangeMinMax(this.min(), this.max());
	};

	Bounds.prototype.intersectWith = function(other)
	{
		var thisMinDimensions = this.min().dimensions();
		var thisMaxDimensions = this.max().dimensions();
		var otherMinDimensions = other.min().dimensions();
		var otherMaxDimensions = other.max().dimensions();

		var rangesForDimensions = [ new Range(), new Range(), new Range() ];
		var rangeOther = new Range();

		var doAllDimensionOverlapSoFar = true;

		for (var d = 0; d < rangesForDimensions.length; d++)
		{
			var rangeThis = rangesForDimensions[d];
			rangeThis.overwriteWithMinAndMax(thisMinDimensions[d], thisMaxDimensions[d]);
			rangeOther.overwriteWithMinAndMax(otherMinDimensions[d], otherMaxDimensions[d]);
			var doesDimensionOverlap = rangeThis.overlapsWith(rangeOther);
			if (doesDimensionOverlap)
			{
				rangeThis.intersectWith(rangeOther);
			}
			else
			{
				doAllDimensionsOverlapSoFar = false;
				break;
			}
		}

		var returnValue = null;

		if (doAllDimensionsOverlapSoFar)
		{
			var center = new Coords();
			var size = new Coords();
			for (var d = 0; d < rangesForDimensions.length; d++)
			{
				var rangeForDimension = rangesForDimensions[d];
				center.dimension(d, rangeForDimension.midpoint());
				size.dimension(d, rangeForDimension.size());
			}

			returnValue = new Bounds(center, size);
		}

		return returnValue;
	};

	Bounds.prototype.max = function()
	{
		return this._max.overwriteWith(this.center).add(this.sizeHalf);
	};

	Bounds.prototype.min = function()
	{
		return this._min.overwriteWith(this.center).subtract(this.sizeHalf);
	};

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
	};

	Bounds.prototype.overlapsWith = function(other)
	{
		return (this.intersectWith(other) != null);
	};

	Bounds.prototype.overlapsWithOtherInDimension = function(other, dimensionIndex)
	{
		var returnValue = false;

		var extremaThisAndOther =
		[
			[ this.min().dimension(dimensionIndex), this.max().dimension(dimensionIndex) ],
			[ other.min().dimension(dimensionIndex), other.max().dimension(dimensionIndex) ]
		];

		for (var b = 0; b < extremaThisAndOther.length; b++)
		{
			var extremaThis = extremaThisAndOther[b];
			var extremaOther = extremaThisAndOther[1 - b];

			var minThisDimension = extremaThis[0];
			var maxThisDimension = extremaThis[1];

			var minOtherDimension = extremaOther[0];
			var maxOtherDimension = extremaOther[1];

			var doDimensionsOverlap =
			(
				maxThisDimension <= minOtherDimension
				|| minThisDimension >= maxOtherDimension
			);
		}

		return returnValue;
	};

	Bounds.prototype.sizeOverwriteWith = function(sizeOther)
	{
		this.size.overwriteWith(sizeOther);
		this.sizeHalf.overwriteWith(this.size).half();
		return this;
	};

	Bounds.prototype.trimCoords = function(coordsToTrim)
	{
		return coordsToTrim.trimToRangeMinMax(this.min(), this.max());
	};

	// cloneable

	Bounds.prototype.clone = function()
	{
		return new Bounds(this.center.clone(), this.size.clone());
	}

	Bounds.prototype.overwriteWith = function(other)
	{
		this.center.overwriteWith(other.center);
		this.size.overwriteWith(other.size);
		this.sizeHalf.overwriteWith(other.size).half();
		return this;
	}

	// string

	Bounds.prototype.toString = function()
	{
		return this.min().toString() + ":" + this.max().toString();
	};

	// transformable

	Bounds.prototype.coordsGroupToTranslate = function()
	{
		return [ this.center ];
	}
}
