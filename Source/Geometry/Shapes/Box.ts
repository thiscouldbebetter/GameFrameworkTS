
class Box
{
	constructor(center, size)
	{
		this.center = center || new Coords();
		this.size = size || new Coords();

		this.sizeHalf = this.size.clone().half();
		this._min = new Coords();
		this._max = new Coords();

		this._range = new Range();
	}

	// Static methods.

	static doBoxesInSetsOverlap(boxSet0, boxSet1)
	{
		var doAnyBoxOverlapSoFar = false;

		for (var i = 0; i < boxSet0.length; i++)
		{
			var boxFromSet0 = boxSet0[i];

			for (var j = 0; j < boxSet1.length; j++)
			{
				var boxFromSet1 = boxSet1[j];

				doAnyBoxOverlapSoFar = boxFromSet0.overlapsWith
				(
					boxFromSet1
				);

				if (doAnyBoxOverlapSoFar)
				{
					break;
				}
			}
		}

		return doAnyBoxOverlapSoFar;
	};

	// Instance methods.

	containsOther(other)
	{
		return ( this.containsPoint(other.min()) && this.containsPoint(other.max()) );
	};

	containsPoint(pointToCheck)
	{
		return pointToCheck.isInRangeMinMax(this.min(), this.max());
	};

	fromMinAndMax(min, max)
	{
		var center = min.clone().add(max).half();
		var size = max.clone().subtract(min);
		return new Box(center, size);
	};

	fromMinAndSize(min, size)
	{
		var center = size.clone().half().add(min);
		return new Box(center, size);
	};

	intersectWith(other)
	{
		var thisMinDimensions = this.min().dimensions();
		var thisMaxDimensions = this.max().dimensions();
		var otherMinDimensions = other.min().dimensions();
		var otherMaxDimensions = other.max().dimensions();

		var rangesForDimensions = [ new Range(), new Range(), new Range() ];
		var rangeOther = new Range();

		var doAllDimensionsOverlapSoFar = true;

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
				center.dimensionSet(d, rangeForDimension.midpoint());
				size.dimensionSet(d, rangeForDimension.size());
			}

			returnValue = new Box(center, size);
		}

		return returnValue;
	};

	max()
	{
		return this._max.overwriteWith(this.center).add(this.sizeHalf);
	};

	min()
	{
		return this._min.overwriteWith(this.center).subtract(this.sizeHalf);
	};

	ofPoints(points)
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

	overlapsWith(other)
	{
		var returnValue =
		(
			this.overlapsWithOtherInDimension(other, 0)
			&& this.overlapsWithOtherInDimension(other, 1)
			&& this.overlapsWithOtherInDimension(other, 2)
		);
		return returnValue;
	};

	overlapsWithXY(other)
	{
		var returnValue =
		(
			this.overlapsWithOtherInDimension(other, 0)
			&& this.overlapsWithOtherInDimension(other, 1)
		);
		return returnValue;
	};

	overlapsWithOtherInDimension(other, dimensionIndex)
	{
		var rangeThis = this.rangeForDimension(dimensionIndex, this._range);
		var rangeOther = other.rangeForDimension(dimensionIndex, other._range);
		var returnValue = rangeThis.overlapsWith(rangeOther);
		return returnValue;
	};

	rangeForDimension(dimensionIndex, range)
	{
		range.min = this.min().dimensionGet(dimensionIndex);
		range.max = this.max().dimensionGet(dimensionIndex);
		return range;
	};

	sizeOverwriteWith(sizeOther)
	{
		this.size.overwriteWith(sizeOther);
		this.sizeHalf.overwriteWith(this.size).half();
		return this;
	};

	touches(other)
	{
		var returnValue =
		(
			this.touchesOtherInDimension(other, 0)
			&& this.touchesOtherInDimension(other, 1)
			&& this.touchesOtherInDimension(other, 2)
		);
		return returnValue;
	};

	touchesXY(other)
	{
		var returnValue =
		(
			this.touchesOtherInDimension(other, 0)
			&& this.touchesOtherInDimension(other, 1)
		);
		return returnValue;
	};

	touchesOtherInDimension(other, dimensionIndex)
	{
		var rangeThis = this.rangeForDimension(dimensionIndex, this._range);
		var rangeOther = other.rangeForDimension(dimensionIndex, other._range);
		var returnValue = rangeThis.touches(rangeOther);
		return returnValue;
	};

	trimCoords(coordsToTrim)
	{
		return coordsToTrim.trimToRangeMinMax(this.min(), this.max());
	};

	// cloneable

	clone()
	{
		return new Box(this.center.clone(), this.size.clone());
	};

	overwriteWith(other)
	{
		this.center.overwriteWith(other.center);
		this.size.overwriteWith(other.size);
		this.sizeHalf.overwriteWith(other.size).half();
		return this;
	};

	// string

	toString()
	{
		return this.min().toString() + ":" + this.max().toString();
	};

	// transformable

	coordsGroupToTranslate()
	{
		return [ this.center ];
	};

	transform(transformToApply)
	{
		Transform.applyTransformToCoordsMany(transformToApply, this.coordsGroupToTranslate());
		return this;
	};
}
