
class BoxAxisAlignedTests extends TestFixture
{
	constructor()
	{
		super(BoxAxisAlignedTests.name);
	}

	tests()
	{
		var tests =
		[
			// Constructoroids.

			this.create,
			this.default,
			this.fromCenterAndSize,
			this.fromMinAndMax_Static,
			this.fromMinAndSize,
			this.fromSize,
			this.fromSizeAndCenter,

			// Static methods.

			this.doBoxesInSetsOverlap,

			// Instance methods.

			this.containPoints,
			this.containsOther,
			this.containsPoint,
			this.fromMinAndMax,
			this.intersectWith,
			this.max,
			this.min,
			this.overlapsWith,
			this.overlapsWithXY,
			this.overlapsWithOtherInDimension,
			this.randomize,
			this.rangeForDimension,
			// this.sizeHalf,
			// this.sizeOverwriteWith,
			// this.touches,
			// this.touchesXY,
			// this.touchesOtherInDimension,
			// this.trimCoords,
			// this.vertices,

			// Clonable.

			// this.clone,
			// this.equals,
			// this.overwriteWith,

			// string

			this.toString,

			// ShapeBase.

			// this.dimensionForSurfaceClosestToPoint,
			// this.normalAtPos,
			// this.surfacePointNearPos,
			// this.toBox,

			// transformable

			// this.coordsGroupToTranslate,
			// this.transform
		];

		return tests;
	}

	// Tests.

	create(): void
	{
		var boxCreated = BoxAxisAligned.create();
		var boxOfSide0AtOrigin =
			BoxAxisAligned.fromSizeAndCenter(Coords.create(), Coords.create());
		Assert.isTrue(boxOfSide0AtOrigin.equals(boxCreated) );
	}

	default(): void
	{
		var boxDefault = BoxAxisAligned.default();
		var boxOfSide1AtOrigin =
			BoxAxisAligned.fromSizeAndCenter(Coords.ones(), Coords.zeroes());
		Assert.isTrue(boxOfSide1AtOrigin.equals(boxDefault) );
	}

	fromCenterAndSize(): void
	{
		var boxToTest = BoxAxisAligned.fromCenterAndSize(Coords.create(), Coords.create());
		var boxOfSide0AtOrigin =
			BoxAxisAligned.fromSizeAndCenter(Coords.create(), Coords.create());
		Assert.isTrue(boxOfSide0AtOrigin.equals(boxToTest) );
	}

	fromMinAndMax_Static(): void
	{
		var min = new Coords(-1, -1, -1);
		var max = Coords.ones();
		var boxToTest = BoxAxisAligned.fromMinAndMax(min, max);

		var boxOfSide2AtOrigin =
			BoxAxisAligned.fromSizeAndCenter(Coords.twos(), Coords.zeroes());
		Assert.isTrue(boxOfSide2AtOrigin.equals(boxToTest) );
	}

	fromMinAndSize(): void
	{
		var min = new Coords(-1, -1, -1);
		var size = new Coords(2, 2, 2);
		var boxToTest = BoxAxisAligned.fromMinAndSize(min, size);

		var boxOfSide2AtOrigin =
			BoxAxisAligned.fromSizeAndCenter(Coords.twos(), Coords.zeroes());
		Assert.isTrue(boxOfSide2AtOrigin.equals(boxToTest) );
	}

	fromSize(): void
	{
		var size = Coords.twos();
		var boxToTest = BoxAxisAligned.fromSize(size);

		var boxOfSide2AtOrigin =
			BoxAxisAligned.fromSizeAndCenter(Coords.twos(), Coords.zeroes());
		Assert.isTrue(boxOfSide2AtOrigin.equals(boxToTest) );
	}

	fromSizeAndCenter(): void
	{
		var center = Coords.zeroes();
		var size = Coords.twos();
		var boxToTest = BoxAxisAligned.fromSizeAndCenter(size, center);

		var boxOfSide2AtOrigin =
			BoxAxisAligned.fromSizeAndCenter(Coords.twos(), Coords.zeroes());
		Assert.isTrue(boxOfSide2AtOrigin.equals(boxToTest) );
	}

	// Static methods.

	doBoxesInSetsOverlap(): void
	{
		var boxSize = Coords.ones();
		var boxOfSide1AtOrigin = BoxAxisAligned.fromSizeAndCenter(boxSize, Coords.zeroes() );
		var boxOfSide1AtXHalf = BoxAxisAligned.fromSizeAndCenter(boxSize, new Coords(.5, 0, 0) );
		var boxOfSide1AtX1 = BoxAxisAligned.fromSizeAndCenter(boxSize, new Coords(1, 0, 0) );

		var doBoxesOverlap =
			BoxAxisAligned.doBoxesInSetsOverlap( [boxOfSide1AtOrigin], [boxOfSide1AtXHalf] );
		Assert.isTrue(doBoxesOverlap);

		doBoxesOverlap =
			BoxAxisAligned.doBoxesInSetsOverlap( [boxOfSide1AtOrigin], [boxOfSide1AtX1] );
		Assert.isFalse(doBoxesOverlap);
	}

	// Instance methods.

	containPoints(): void
	{
		var pointOrigin = Coords.zeroes();
		var pointOnes = Coords.ones();
		var pointNegativeOnes = Coords.ones().invert();
		var points = [ pointOrigin, pointOnes, pointNegativeOnes ];

		var boxFromPoints = BoxAxisAligned.create().containPoints(points);

		var boxOfSize2AtOrigin = BoxAxisAligned.fromSize(Coords.twos() );

		Assert.isTrue(boxOfSize2AtOrigin.equals(boxFromPoints) );
	}

	containsOther(): void
	{
		var boxContaining = BoxAxisAligned.fromSize(Coords.twos() );
		var boxContained = BoxAxisAligned.fromSize(Coords.ones() );

		Assert.isTrue(boxContaining.containsOther(boxContained) );
		Assert.isFalse(boxContained.containsOther(boxContaining) );
	}

	containsPoint(): void
	{
		var box = BoxAxisAligned.fromSize(Coords.ones());

		Assert.isTrue(box.containsPoint(Coords.zeroes() ) );
		Assert.isFalse(box.containsPoint(new Coords(2, 0, 0) ) );
	}

	fromMinAndMax(): void
	{
		var boxBefore = BoxAxisAligned.fromSize(Coords.ones());
		var boxOfSize1AtOrigin = BoxAxisAligned.fromSize(Coords.ones() );
		Assert.isTrue(boxOfSize1AtOrigin.equals(boxBefore) );

		var min = Coords.create().randomize(null);
		var max = Coords.create().randomize(null).add(min);
		var boxAfter = boxBefore.fromMinAndMax(min, max);
		Assert.isFalse(boxOfSize1AtOrigin.equals(boxAfter) );
	}

	intersectWith(): void
	{
		var twos = Coords.ones().double();
		var boxOfSize2AtOrigin =
			BoxAxisAligned.fromSizeAndCenter(twos, Coords.zeroes());
		var boxOfSize2AtOnes =
			BoxAxisAligned.fromSizeAndCenter(twos, Coords.ones());
		var boxOfSize2AtNegativeOnes =
			BoxAxisAligned.fromSizeAndCenter(twos, Coords.ones().invert());

		var boxIntersection =
			boxOfSize2AtOnes.intersectWith(boxOfSize2AtNegativeOnes)

		Assert.isNull(boxIntersection);

		boxIntersection =
			boxOfSize2AtOrigin.intersectWith(boxOfSize2AtNegativeOnes)

		Assert.isNotNull(boxIntersection);

	}

	max(): void
	{
		var decimalPlaces = 3;
		var min = Coords.create().randomize(null).roundToDecimalPlaces(decimalPlaces);
		var max = Coords.create().randomize(null).add(min).roundToDecimalPlaces(decimalPlaces);
		var box = BoxAxisAligned.fromMinAndMax(min, max);

		Assert.isTrue(max.equalsWithinOneBillionth(box.max() ) );
	}

	min(): void
	{
		var decimalPlaces = 3;
		var min = Coords.create().randomize(null).roundToDecimalPlaces(decimalPlaces);
		var max = Coords.create().randomize(null).add(min).roundToDecimalPlaces(decimalPlaces);
		var box = BoxAxisAligned.fromMinAndMax(min, max);

		Assert.isTrue(min.equalsWithinOneBillionth(box.min() ) );
	}

	overlapsWith(): void
	{
		var ones = Coords.ones();
		var boxOfSize1AtOrigin = BoxAxisAligned.fromSize(ones);
		var boxOfSize1AtXHalf =
			BoxAxisAligned.fromSizeAndCenter(ones, new Coords(.5, 0, 0) );
		var boxOfSize1AtX1 =
			BoxAxisAligned.fromSizeAndCenter(ones, new Coords(1, 0, 0) );

		var doBoxesOverlap =
			boxOfSize1AtOrigin.overlapsWith(boxOfSize1AtXHalf);
		Assert.isTrue(doBoxesOverlap);

		doBoxesOverlap =
			boxOfSize1AtOrigin.overlapsWith(boxOfSize1AtX1);
		Assert.isFalse(doBoxesOverlap);
	}

	overlapsWithXY(): void
	{
		var ones = Coords.ones();
		var boxOfSize1AtOrigin = BoxAxisAligned.fromSize(ones);
		var boxOfSize1AtXHalfZTen =
			BoxAxisAligned.fromSizeAndCenter(ones, new Coords(.5, 0, 10) );

		var doBoxesOverlap =
			boxOfSize1AtOrigin.overlapsWithXY(boxOfSize1AtXHalfZTen);
		Assert.isTrue(doBoxesOverlap);
	}

	overlapsWithOtherInDimension(): void
	{
		var ones = Coords.ones();
		var boxOfSize1AtOrigin = BoxAxisAligned.fromSize(ones);
		var boxOfSize1AtXHalfZTen =
			BoxAxisAligned.fromSizeAndCenter(ones, new Coords(.5, 0, 10) );

		var doBoxesOverlap = boxOfSize1AtOrigin.overlapsWithOtherInDimension
		(
			boxOfSize1AtXHalfZTen, 0
		);
		Assert.isTrue(doBoxesOverlap);

		doBoxesOverlap = boxOfSize1AtOrigin.overlapsWithOtherInDimension
		(
			boxOfSize1AtXHalfZTen, 1
		);
		Assert.isTrue(doBoxesOverlap);

		doBoxesOverlap = boxOfSize1AtOrigin.overlapsWithOtherInDimension
		(
			boxOfSize1AtXHalfZTen, 2
		);
		Assert.isFalse(doBoxesOverlap);
	}

	pointRandom(randomizer: Randomizer): void
	{
		Assert.isTrue(true); // todo
	}

	randomize(): void
	{
		var sizeBefore = Coords.ones();
		var centerBefore = Coords.zeroes();

		var boxBefore =
			BoxAxisAligned.fromSizeAndCenter(sizeBefore.clone(), centerBefore.clone());

		var boxAfter = boxBefore.clone();

		boxAfter.randomize(null);

		Assert.isFalse(boxBefore.equals(boxAfter) );
	}

	rangeForDimension(): void
	{
		var box = BoxAxisAligned.fromSize(new Coords(1, 2, 3));
		var boxSize = box.size;

		var boxRangeX = box.rangeForDimension(0, RangeExtent.create() );
		Assert.areNumbersEqual(boxRangeX.size(), boxSize.x);

		var boxRangeY = box.rangeForDimension(1, RangeExtent.create() );
		Assert.areNumbersEqual(boxRangeY.size(), boxSize.y);

		var boxRangeZ = box.rangeForDimension(2, RangeExtent.create() );
		Assert.areNumbersEqual(boxRangeZ.size(), boxSize.z);
	}

	sizeHalf(): void
	{
		throw new Error("Not yet implemented!");
	}

	sizeOverwriteWith(): void // sizeOther: Coords): Box
	{
		throw new Error("Not yet implemented!");
	}

	touches(): void // other: Box): boolean
	{
		throw new Error("Not yet implemented!");
	}

	touchesXY(): void // other: Box): boolean
	{
		throw new Error("Not yet implemented!");
	}

	touchesOtherInDimension(): void // other: Box, dimensionIndex: number): boolean
	{
		throw new Error("Not yet implemented!");
	}

	trimCoords(): void // coordsToTrim: Coords): Coords
	{
		throw new Error("Not yet implemented!");
	}

	vertices(): void // ): Coords[]
	{
		throw new Error("Not yet implemented!");
	}

	// Clonable.

	clone(): void
	{
		var boxToClone = BoxAxisAligned.create().randomize(null);
		var boxCloned = boxToClone.clone();
		Assert.isTrue(boxToClone.equals(boxCloned) );
	}

	equals(): void
	{
		var box0 = BoxAxisAligned.create().randomize(null);
		var box1 = BoxAxisAligned.create().randomize(null);

		Assert.isFalse(box0.equals(box1) );

		box1.overwriteWith(box0);

		Assert.isTrue(box0.equals(box1) );
	}

	overwriteWith(): void
	{
		var box0 = BoxAxisAligned.create().randomize(null);
		var box1 = BoxAxisAligned.create().randomize(null);

		Assert.isFalse(box0.equals(box1) );

		box1.overwriteWith(box0);

		Assert.isTrue(box0.equals(box1) );
	}

	// string

	toString(): void
	{
		var boxOfSize1AtOrigin = BoxAxisAligned.fromSize(Coords.ones())
		var boxAsString = boxOfSize1AtOrigin.toString();

		var boxAsStringExpected = "-0.5x-0.5x-0.5:0.5x0.5x0.5";
		Assert.areStringsEqual(boxAsStringExpected, boxAsString);
	}

	// ShapeBase.

	dimensionForSurfaceClosestToPoint(): void
	{
		throw new Error("Not yet implemented!");
	}

	normalAtPos(): void
	{
		var boxOfSize2AtOrigin = BoxAxisAligned.fromSize(Coords.twos());
		var posToCheck = new Coords(1, 0, 0);
		var normalAtPosToCheck =
			boxOfSize2AtOrigin.normalAtPos(posToCheck, Coords.create());

		var normalExpected = new Coords(1, 0, 0);
		Assert.isTrue(normalExpected.equals(normalAtPosToCheck) );
	}

	surfacePointNearPos(): void
	{
		var boxOfSize2AtOrigin = BoxAxisAligned.fromSize(Coords.twos());
		var posToCheck = new Coords(1, 0, 0);
		var surfacePointAtPosToCheck =
			boxOfSize2AtOrigin.surfacePointNearPos(posToCheck, Coords.create());

		var surfacePointExpected = new Coords(1, 0, 0);
		Assert.isTrue(surfacePointExpected.equals(surfacePointAtPosToCheck) );
	}

	toBoxAxisAligned(): void
	{
		var box = BoxAxisAligned.create().randomize(null);

		var boxAsBox = box.toBoxAxisAligned(BoxAxisAligned.create());

		Assert.isTrue(box.equals(boxAsBox) );
	}

	// transformable

	transform(): void // transformToApply: Transform): Transformable
	{
		var box = BoxAxisAligned.create().randomize(null);
		var boxCenterBeforeTransform = box.center.clone();

		var displacementToTranslate = Coords.create().randomize(null);
		var translateToApply = new Transform_Translate(displacementToTranslate);

		box.transform(translateToApply);

		var boxCenterAfterTransform = box.center;

		var boxDisplacement = boxCenterAfterTransform.clone().subtract
		(
			boxCenterBeforeTransform
		);

		Assert.isTrue(displacementToTranslate.equals(boxDisplacement) );
	}
}
