
namespace ThisCouldBeBetter.GameFramework
{

export class Box implements ShapeBase
{
	center: Coords;
	size: Coords;

	_min: Coords;
	_max: Coords;
	_range: RangeExtent;
	_sizeHalf: Coords;
	_vertices: Coords[];

	constructor(center: Coords, size: Coords)
	{
		this.center = center || Coords.create();
		this.size = size || Coords.create();

		this._sizeHalf = Coords.create();
		this._min = Coords.create();
		this._max = Coords.create();

		this._range = new RangeExtent(0, 0);
	}

	static create(): Box
	{
		return Box.fromCenterAndSize(Coords.create(), Coords.create());
	}

	static default(): Box
	{
		return Box.fromCenterAndSize(Coords.zeroes(), Coords.ones() );
	}

	static fromCenterAndSize(center: Coords, size: Coords): Box
	{
		// This takes the same arguments as the constructor.
		return new Box(center, size);
	}

	static fromMinAndMax(min: Coords, max: Coords): Box
	{
		var center = min.clone().add(max).half();
		var size = max.clone().subtract(min);
		return new Box(center, size);
	}

	static fromMinAndSize(min: Coords, size: Coords): Box
	{
		var center = size.clone().half().add(min);
		return new Box(center, size);
	}

	static fromSize(size: Coords): Box
	{
		return new Box(Coords.zeroes(), size);
	}

	static fromSizeAndCenter(size: Coords, center: Coords): Box
	{
		// Same arguments as the constructor, but different order.
		return new Box(center, size);
	}

	// Static methods.

	static doBoxesInSetsOverlap(boxSet0: Box[], boxSet1: Box[]): boolean
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
	}

	// Instance methods.

	containsOther(other: Box): boolean
	{
		return ( this.containsPoint(other.min()) && this.containsPoint(other.max()) );
	}

	containsPoint(pointToCheck: Coords): boolean
	{
		return pointToCheck.isInRangeMinMax(this.min(), this.max());
	}

	fromMinAndMax(min: Coords, max: Coords): Box
	{
		this.center.overwriteWith(min).add(max).half();
		this.size.overwriteWith(max).subtract(min);
		return this;
	}

	intersectWith(other: Box): Box
	{
		var thisMinDimensions = this.min().dimensions();
		var thisMaxDimensions = this.max().dimensions();
		var otherMinDimensions = other.min().dimensions();
		var otherMaxDimensions = other.max().dimensions();

		var rangesForDimensions = [ new RangeExtent(0, 0), new RangeExtent(0, 0), new RangeExtent(0, 0) ];
		var rangeOther = new RangeExtent(0, 0);

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
			var center = Coords.create();
			var size = Coords.create();
			for (var d = 0; d < rangesForDimensions.length; d++)
			{
				var rangeForDimension = rangesForDimensions[d];
				center.dimensionSet(d, rangeForDimension.midpoint());
				size.dimensionSet(d, rangeForDimension.size());
			}

			returnValue = new Box(center, size);
		}

		return returnValue;
	}

	locate(loc: Disposition): Box
	{
		this.center.overwriteWith(loc.pos);
		return this;
	}

	max(): Coords
	{
		return this._max.overwriteWith(this.center).add(this.sizeHalf());
	}

	min(): Coords
	{
		return this._min.overwriteWith(this.center).subtract(this.sizeHalf());
	}

	ofPoints(points: Coords[]): Box
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

		return this;
	}

	overlapsWith(other: Box): boolean
	{
		var returnValue =
		(
			this.overlapsWithOtherInDimension(other, 0)
			&& this.overlapsWithOtherInDimension(other, 1)
			&& this.overlapsWithOtherInDimension(other, 2)
		);
		return returnValue;
	}

	overlapsWithXY(other: Box): boolean
	{
		var returnValue =
		(
			this.overlapsWithOtherInDimension(other, 0)
			&& this.overlapsWithOtherInDimension(other, 1)
		);
		return returnValue;
	}

	overlapsWithOtherInDimension(other: Box, dimensionIndex: number): boolean
	{
		var rangeThis = this.rangeForDimension(dimensionIndex, this._range);
		var rangeOther = other.rangeForDimension(dimensionIndex, other._range);
		var returnValue = rangeThis.overlapsWith(rangeOther);
		return returnValue;
	}

	randomize(randomizer: Randomizer): Box
	{
		this.center.randomize(randomizer);
		this.size.randomize(randomizer);

		return this;
	}

	rangeForDimension(dimensionIndex: number, rangeOut: RangeExtent): RangeExtent
	{
		rangeOut.min = this.min().dimensionGet(dimensionIndex);
		rangeOut.max = this.max().dimensionGet(dimensionIndex);
		return rangeOut;
	}

	sizeHalf(): Coords
	{
		return this._sizeHalf.overwriteWith(this.size).half();
	}

	sizeOverwriteWith(sizeOther: Coords): Box
	{
		this.size.overwriteWith(sizeOther);
		return this;
	}

	touches(other: Box): boolean
	{
		var returnValue =
		(
			this.touchesOtherInDimension(other, 0)
			&& this.touchesOtherInDimension(other, 1)
			&& this.touchesOtherInDimension(other, 2)
		);
		return returnValue;
	}

	touchesXY(other: Box): boolean
	{
		var returnValue =
		(
			this.touchesOtherInDimension(other, 0)
			&& this.touchesOtherInDimension(other, 1)
		);
		return returnValue;
	}

	touchesOtherInDimension(other: Box, dimensionIndex: number): boolean
	{
		var rangeThis = this.rangeForDimension(dimensionIndex, this._range);
		var rangeOther = other.rangeForDimension(dimensionIndex, other._range);
		var returnValue = rangeThis.touches(rangeOther);
		return returnValue;
	}

	trimCoords(coordsToTrim: Coords): Coords
	{
		return coordsToTrim.trimToRangeMinMax(this.min(), this.max());
	}

	vertices(): Coords[]
	{
		if (this._vertices == null)
		{
			this._vertices = [];
			// todo
		}
		return this._vertices;
	}

	// Clonable.

	clone(): Box
	{
		return new Box(this.center.clone(), this.size.clone());
	}

	overwriteWith(other: Box): Box
	{
		this.center.overwriteWith(other.center);
		this.size.overwriteWith(other.size);
		return this;
	}

	// Equatable

	equals(other: Box): boolean
	{
		var returnValue =
		(
			this.center.equals(other.center)
			&& this.size.equals(other.size)
		);

		return returnValue;
	}

	// string

	toString(): string
	{
		return this.min().toString() + ":" + this.max().toString();
	}

	// ShapeBase.

	collider(): ShapeBase { return null; }

	dimensionForSurfaceClosestToPoint
	(
		posToCheck: Coords, displacementOverSizeHalf: Coords
	): number
	{
		var greatestAbsoluteDisplacementDimensionSoFar = -1;
		var dimensionIndex = null;

		for (var d = 0; d < 3; d++) // dimension
		{
			var displacementDimensionOverSizeHalf
				= displacementOverSizeHalf.dimensionGet(d);
			var displacementDimensionOverSizeHalfAbsolute
				= Math.abs(displacementDimensionOverSizeHalf);

			if
			(
				displacementDimensionOverSizeHalfAbsolute
				> greatestAbsoluteDisplacementDimensionSoFar
			)
			{
				greatestAbsoluteDisplacementDimensionSoFar =
					displacementDimensionOverSizeHalfAbsolute;
				dimensionIndex = d;
			}
		}

		return dimensionIndex;
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		var displacementOverSizeHalf = normalOut.overwriteWith
		(
			posToCheck
		).subtract
		(
			this.center
		).divide
		(
			this.sizeHalf()
		);

		var dimensionIndex =
			this.dimensionForSurfaceClosestToPoint(posToCheck, displacementOverSizeHalf);

		var displacementDimensionOverSizeHalf
			= displacementOverSizeHalf.dimensionGet(dimensionIndex);

		var multiplier = (displacementDimensionOverSizeHalf > 0 ? 1 : -1);

		normalOut.clear().dimensionSet(dimensionIndex, 1).multiplyScalar(multiplier);

		return normalOut;
	}

	pointRandom(randomizer: Randomizer): Coords
	{
		var min = this.min();
		var offset = Coords.default().randomize
		(
			randomizer
		).multiply
		(
			this.size
		);
		var pos = offset.add(min);
		return pos;
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		return surfacePointOut.overwriteWith(posToCheck); // todo
	}

	toBox(boxOut: Box): Box
	{
		return boxOut.overwriteWith(this);
	}

	// transformable

	coordsGroupToTranslate(): Coords[]
	{
		return [ this.center ];
	}

	transform(transformToApply: TransformBase): Box
	{
		Transforms.applyTransformToCoordsMany
		(
			transformToApply, this.coordsGroupToTranslate()
		);
		return this;
	}
}

}
