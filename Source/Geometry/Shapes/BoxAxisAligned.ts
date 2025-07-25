
namespace ThisCouldBeBetter.GameFramework
{

export class BoxAxisAligned extends ShapeBase
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
		super();

		this.center = center || Coords.create();
		this.size = size || Coords.create();

		this._sizeHalf = Coords.create();
		this._min = Coords.create();
		this._max = Coords.create();

		this._range = new RangeExtent(0, 0);
	}

	static create(): BoxAxisAligned
	{
		return BoxAxisAligned.fromCenterAndSize(Coords.create(), Coords.create());
	}

	static default(): BoxAxisAligned
	{
		return BoxAxisAligned.fromCenterAndSize(Coords.zeroes(), Coords.ones() );
	}

	static fromCenterAndSize(center: Coords, size: Coords): BoxAxisAligned
	{
		// This takes the same arguments as the constructor.
		return new BoxAxisAligned(center, size);
	}

	static fromMinAndMax(min: Coords, max: Coords): BoxAxisAligned
	{
		var center = min.clone().add(max).half();
		var size = max.clone().subtract(min);
		return new BoxAxisAligned(center, size);
	}

	static fromMinAndSize(min: Coords, size: Coords): BoxAxisAligned
	{
		var center = size.clone().half().add(min);
		return new BoxAxisAligned(center, size);
	}

	static fromSize(size: Coords): BoxAxisAligned
	{
		return new BoxAxisAligned(Coords.zeroes(), size);
	}

	static fromSizeAndCenter(size: Coords, center: Coords): BoxAxisAligned
	{
		// Same arguments as the constructor, but different order.
		return new BoxAxisAligned(center, size);
	}

	// Static methods.

	static doBoxesInSetsOverlap(boxSet0: BoxAxisAligned[], boxSet1: BoxAxisAligned[]): boolean
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

	containOthers(boxes: BoxAxisAligned[]): BoxAxisAligned
	{
		var boxExtremes = new Array<Coords>();

		boxes.forEach
		(
			box =>
			{
				boxExtremes.push(box.min());
				boxExtremes.push(box.max());
			}
		)

		var boxContainingBoxes =
			this.containPoints(boxExtremes);

		return boxContainingBoxes;
	}

	containPoints(points: Coords[]): BoxAxisAligned
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

		this.center
			.overwriteWith(minSoFar)
			.add(maxSoFar)
			.half();
		this.size
			.overwriteWith(maxSoFar)
			.subtract(minSoFar);

		return this;
	}

	containsOther(other: BoxAxisAligned): boolean
	{
		return ( this.containsPoint(other.min()) && this.containsPoint(other.max()) );
	}

	containsPointXY(pointToCheck: Coords): boolean
	{
		return pointToCheck.isInRangeMinMaxXY(this.min(), this.max());
	}

	fromMinAndMax(min: Coords, max: Coords): BoxAxisAligned
	{
		this.center.overwriteWith(min).add(max).half();
		this.size.overwriteWith(max).subtract(min);
		return this;
	}

	intersectWith(other: BoxAxisAligned): BoxAxisAligned
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

			returnValue = BoxAxisAligned.fromCenterAndSize(center, size);
		}

		return returnValue;
	}

	max(): Coords
	{
		return this._max.overwriteWith(this.center).add(this.sizeHalf());
	}

	min(): Coords
	{
		return this._min.overwriteWith(this.center).subtract(this.sizeHalf());
	}

	overlapsWith(other: BoxAxisAligned): boolean
	{
		var returnValue =
		(
			this.overlapsWithOtherInDimension(other, 0)
			&& this.overlapsWithOtherInDimension(other, 1)
			&& this.overlapsWithOtherInDimension(other, 2)
		);
		return returnValue;
	}

	overlapsWithXY(other: BoxAxisAligned): boolean
	{
		var returnValue =
		(
			this.overlapsWithOtherInDimension(other, 0)
			&& this.overlapsWithOtherInDimension(other, 1)
		);
		return returnValue;
	}

	overlapsWithOtherInDimension(other: BoxAxisAligned, dimensionIndex: number): boolean
	{
		var rangeThis = this.rangeForDimension(dimensionIndex, this._range);
		var rangeOther = other.rangeForDimension(dimensionIndex, other._range);
		var returnValue = rangeThis.overlapsWith(rangeOther);
		return returnValue;
	}

	randomize(randomizer: Randomizer): BoxAxisAligned
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

	sizeOverwriteWith(sizeOther: Coords): BoxAxisAligned
	{
		this.size.overwriteWith(sizeOther);
		return this;
	}

	touches(other: BoxAxisAligned): boolean
	{
		var returnValue =
		(
			this.touchesOtherInDimension(other, 0)
			&& this.touchesOtherInDimension(other, 1)
			&& this.touchesOtherInDimension(other, 2)
		);
		return returnValue;
	}

	touchesXY(other: BoxAxisAligned): boolean
	{
		var returnValue =
		(
			this.touchesOtherInDimension(other, 0)
			&& this.touchesOtherInDimension(other, 1)
		);
		return returnValue;
	}

	touchesOtherInDimension(other: BoxAxisAligned, dimensionIndex: number): boolean
	{
		var rangeThis = this.rangeForDimension(dimensionIndex, this._range);
		var rangeOther = other.rangeForDimension(dimensionIndex, other._range);
		var returnValue = rangeThis.touches(rangeOther);
		return returnValue;
	}

	trimCoords(coordsToTrim: Coords): Coords
	{
		var min = this.min();
		var max = this.max();
		return coordsToTrim.trimToRangeMinMax(min, max);
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

	clone(): BoxAxisAligned
	{
		return new BoxAxisAligned(this.center.clone(), this.size.clone());
	}

	overwriteWith(other: BoxAxisAligned): BoxAxisAligned
	{
		this.center.overwriteWith(other.center);
		this.size.overwriteWith(other.size);
		return this;
	}

	// Equatable

	equals(other: BoxAxisAligned): boolean
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

	toStringXY(): string
	{
		return this.min().toStringXY() + ":" + this.max().toStringXY();
	}

	// ShapeBase.

	containsPoint(pointToCheck: Coords): boolean
	{
		return pointToCheck.isInRangeMinMax(this.min(), this.max());
	}

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

	toBoxAxisAligned(boxOut: BoxAxisAligned): BoxAxisAligned
	{
		return boxOut.overwriteWith(this);
	}

	// Transformable.

	transform(transformToApply: TransformBase): BoxAxisAligned
	{
		transformToApply.transformCoords(this.center);
		return this;
	}
}

}
