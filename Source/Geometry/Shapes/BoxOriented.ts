
namespace ThisCouldBeBetter.GameFramework
{

export class BoxOriented extends ShapeBase
{
	center: Coords;
	ori: Orientation;
	displacementFromCenterToCornerForwardRightDown: Coords;

	private _displacement: Coords;

	constructor
	(
		center: Coords,
		ori: Orientation,
		displacementFromCenterToCornerForwardRightDown: Coords
	)
	{
		super();

		this.center = center || Coords.create();
		this.ori = ori || Orientation.default();
		this.displacementFromCenterToCornerForwardRightDown =
			displacementFromCenterToCornerForwardRightDown
			|| Coords.fromXYZ(1, 0, 0);

		this._displacement = Coords.create();
	}

	static create(): BoxOriented
	{
		return new BoxOriented(Coords.create(), Orientation.default(), Coords.zeroZeroOne() );
	}

	static default(): BoxOriented
	{
		return BoxOriented.fromCenterAndSize(Coords.zeroes(), Coords.ones() );
	}

	static fromCenterAndSize(center: Coords, size: Coords): BoxOriented
	{
		return new BoxOriented(center, Orientation.default(), size.clone().half() );
	}

	static fromCenterOriAndDisplacementToCorner
	(
		center: Coords,
		ori: Orientation,
		displacementFromCenterToCornerForwardRightDown: Coords
	): BoxOriented
	{
		return new BoxOriented
		(
			center, ori, displacementFromCenterToCornerForwardRightDown
		);
	}

	static fromSize(size: Coords): BoxOriented
	{
		return BoxOriented.fromCenterAndSize(Coords.zeroes(), size);
	}

	static fromSizeAndCenter(size: Coords, center: Coords): BoxOriented
	{
		return BoxOriented.fromCenterAndSize(center, size);
	}

	// Instance methods.

	cachedValuesClear(): BoxOriented
	{
		this._corners = null;
		this._size = null;
		return this;
	}

	containsOther(other: BoxOriented): boolean
	{
		var cornersOfOther = other.corners();
		var cornersOfOtherAreNotAllContainedInThis =
			cornersOfOther.some(x => this.containsPoint(x) == false);
		var thisContainsAllCornersOfOther =
			(cornersOfOtherAreNotAllContainedInThis == false);
		return thisContainsAllCornersOfOther;
	}

	containsPoint(pointToCheck: Coords): boolean
	{
		var displacementFromCenterToPointToCheck =
			this._displacement
				.overwriteWith(pointToCheck)
				.subtract(this.center);
		var pointToCheckProjectedOntoBoxAxes =
			this.ori.projectCoords(displacementFromCenterToPointToCheck);
		var sizeHalf = this.sizeHalf();
		var pointIsContained =
			pointToCheckProjectedOntoBoxAxes
				.isInRangeMax(sizeHalf);
		return pointIsContained;
	}

	_corners: Coords[];
	corners(): Coords[]
	{
		if (this._corners == null)
		{
			var cornersRelative: Coords[] =
			[
				//todo
			];
			this._corners =
				cornersRelative.map(x => x.add(this.center) );

		}
		return this._corners;
	}

	_size: Coords;
	size(): Coords
	{
		if (this._size == null)
		{
			this._size =
				this.displacementFromCenterToCornerForwardRightDown
					.clone()
					.double();
		}
		return this._size;
	}

	_sizeHalf: Coords;
	sizeHalf(): Coords
	{
		if (this._sizeHalf == null)
		{
			this._sizeHalf = this.size().clone().half();
		}
		return this._sizeHalf;
	}

	// Clonable.

	clone(): BoxOriented
	{
		return BoxOriented.fromCenterOriAndDisplacementToCorner
		(
			this.center.clone(),
			this.ori.clone(),
			this.displacementFromCenterToCornerForwardRightDown.clone()
		);
	}

	overwriteWith(other: BoxOriented): BoxOriented
	{
		this.center.overwriteWith(other.center);
		this.displacementFromCenterToCornerForwardRightDown
			.overwriteWith
			(
				other.displacementFromCenterToCornerForwardRightDown
			);
		this.cachedValuesClear();
		return this;
	}

	// Equatable

	equals(other: BoxOriented): boolean
	{
		var returnValue =
		(
			this.center.equals(other.center)
			&& this.size().equals(other.size())
		);

		return returnValue;
	}

	// ShapeBase.

	pointRandom(randomizer: Randomizer): Coords
	{
		var size = this.size();
		return this._displacement.randomize(randomizer).multiply(size);
		// todo - Orient it?
	}

	toBoxAxisAligned(boxOut: BoxAxisAligned): BoxAxisAligned
	{
		var corners = this.corners();
		return boxOut.containPoints(corners);
	}

	// Transformable.

	transform(transformToApply: TransformBase): BoxOriented
	{
		transformToApply.transformCoords(this.center);
		transformToApply.transformCoords
		(
			this.displacementFromCenterToCornerForwardRightDown
		);
		var oriAxes = this.ori.axes;
		for (var i = 0; i < oriAxes.length; i++)
		{
			var oriAxis = oriAxes[i];
			transformToApply.transformCoords(oriAxis);
		}
		this.ori.normalize();
		return this;
	}
}

}
