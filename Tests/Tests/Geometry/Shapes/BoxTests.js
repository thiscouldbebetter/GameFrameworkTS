"use strict";
class BoxTests extends TestFixture {
    constructor() {
        super(BoxTests.name);
    }
    tests() {
        var tests = [
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
            this.containsOther,
            this.containsPoint,
            this.fromMinAndMax,
            this.intersectWith,
            this.locate,
            this.max,
            this.min,
            this.ofPoints,
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
    create() {
        var boxCreated = Box.create();
        var boxOfSide0AtOrigin = Box.fromSizeAndCenter(Coords.create(), Coords.create());
        Assert.isTrue(boxOfSide0AtOrigin.equals(boxCreated));
    }
    default() {
        var boxDefault = Box.default();
        var boxOfSide1AtOrigin = Box.fromSizeAndCenter(Coords.ones(), Coords.zeroes());
        Assert.isTrue(boxOfSide1AtOrigin.equals(boxDefault));
    }
    fromCenterAndSize() {
        var boxToTest = Box.fromCenterAndSize(Coords.create(), Coords.create());
        var boxOfSide0AtOrigin = Box.fromSizeAndCenter(Coords.create(), Coords.create());
        Assert.isTrue(boxOfSide0AtOrigin.equals(boxToTest));
    }
    fromMinAndMax_Static() {
        var min = new Coords(-1, -1, -1);
        var max = new Coords(1, 1, 1);
        var boxToTest = Box.fromMinAndMax(min, max);
        var boxOfSide2AtOrigin = Box.fromSizeAndCenter(Coords.twos(), Coords.zeroes());
        Assert.isTrue(boxOfSide2AtOrigin.equals(boxToTest));
    }
    fromMinAndSize() {
        var min = new Coords(-1, -1, -1);
        var size = new Coords(2, 2, 2);
        var boxToTest = Box.fromMinAndSize(min, size);
        var boxOfSide2AtOrigin = Box.fromSizeAndCenter(Coords.twos(), Coords.zeroes());
        Assert.isTrue(boxOfSide2AtOrigin.equals(boxToTest));
    }
    fromSize() {
        var size = Coords.twos();
        var boxToTest = Box.fromSize(size);
        var boxOfSide2AtOrigin = Box.fromSizeAndCenter(Coords.twos(), Coords.zeroes());
        Assert.isTrue(boxOfSide2AtOrigin.equals(boxToTest));
    }
    fromSizeAndCenter() {
        var center = Coords.zeroes();
        var size = Coords.twos();
        var boxToTest = Box.fromSizeAndCenter(size, center);
        var boxOfSide2AtOrigin = Box.fromSizeAndCenter(Coords.twos(), Coords.zeroes());
        Assert.isTrue(boxOfSide2AtOrigin.equals(boxToTest));
    }
    // Static methods.
    doBoxesInSetsOverlap() {
        var boxSize = new Coords(1, 1, 1);
        var boxOfSide1AtOrigin = Box.fromSizeAndCenter(boxSize, new Coords(0, 0, 0));
        var boxOfSide1AtXHalf = Box.fromSizeAndCenter(boxSize, new Coords(.5, 0, 0));
        var boxOfSide1AtX1 = Box.fromSizeAndCenter(boxSize, new Coords(1, 0, 0));
        var doBoxesOverlap = Box.doBoxesInSetsOverlap([boxOfSide1AtOrigin], [boxOfSide1AtXHalf]);
        Assert.isTrue(doBoxesOverlap);
        doBoxesOverlap =
            Box.doBoxesInSetsOverlap([boxOfSide1AtOrigin], [boxOfSide1AtX1]);
        Assert.isFalse(doBoxesOverlap);
    }
    // Instance methods.
    containsOther() {
        var boxContaining = Box.fromSize(Coords.twos());
        var boxContained = Box.fromSize(Coords.ones());
        Assert.isTrue(boxContaining.containsOther(boxContained));
        Assert.isFalse(boxContained.containsOther(boxContaining));
    }
    containsPoint() {
        var box = Box.fromSize(Coords.ones());
        Assert.isTrue(box.containsPoint(Coords.zeroes()));
        Assert.isFalse(box.containsPoint(new Coords(2, 0, 0)));
    }
    fromMinAndMax() {
        var boxBefore = Box.fromSize(Coords.ones());
        var boxOfSize1AtOrigin = Box.fromSize(Coords.ones());
        Assert.isTrue(boxOfSize1AtOrigin.equals(boxBefore));
        var min = Coords.create().randomize(null);
        var max = Coords.create().randomize(null).add(min);
        var boxAfter = boxBefore.fromMinAndMax(min, max);
        Assert.isFalse(boxOfSize1AtOrigin.equals(boxAfter));
    }
    intersectWith() {
        var twos = Coords.ones().double();
        var boxOfSize2AtOrigin = Box.fromSizeAndCenter(twos, Coords.zeroes());
        var boxOfSize2AtOnes = Box.fromSizeAndCenter(twos, Coords.ones());
        var boxOfSize2AtNegativeOnes = Box.fromSizeAndCenter(twos, Coords.ones().invert());
        var boxIntersection = boxOfSize2AtOnes.intersectWith(boxOfSize2AtNegativeOnes);
        Assert.isNull(boxIntersection);
        boxIntersection =
            boxOfSize2AtOrigin.intersectWith(boxOfSize2AtNegativeOnes);
        Assert.isNotNull(boxIntersection);
    }
    locate() {
        var boxToLocate = Box.create().randomize(null);
        var boxCenter = boxToLocate.center;
        var posToLocateTo = Coords.create().randomize(null);
        var locToApply = Disposition.fromPos(posToLocateTo);
        Assert.isFalse(posToLocateTo.equals(boxCenter));
        boxToLocate.locate(locToApply);
        Assert.isTrue(posToLocateTo.equals(boxCenter));
    }
    max() {
        var decimalPlaces = 3;
        var min = Coords.create().randomize(null).roundToDecimalPlaces(decimalPlaces);
        var max = Coords.create().randomize(null).add(min).roundToDecimalPlaces(decimalPlaces);
        var box = Box.fromMinAndMax(min, max);
        Assert.isTrue(max.equalsWithinOneBillionth(box.max()));
    }
    min() {
        var decimalPlaces = 3;
        var min = Coords.create().randomize(null).roundToDecimalPlaces(decimalPlaces);
        var max = Coords.create().randomize(null).add(min).roundToDecimalPlaces(decimalPlaces);
        var box = Box.fromMinAndMax(min, max);
        Assert.isTrue(min.equalsWithinOneBillionth(box.min()));
    }
    ofPoints() {
        var pointOrigin = Coords.zeroes();
        var pointOnes = Coords.ones();
        var pointNegativeOnes = Coords.ones().invert();
        var points = [pointOrigin, pointOnes, pointNegativeOnes];
        var boxFromPoints = Box.create().ofPoints(points);
        var boxOfSize2AtOrigin = Box.fromSize(Coords.twos());
        Assert.isTrue(boxOfSize2AtOrigin.equals(boxFromPoints));
    }
    overlapsWith() {
        var ones = Coords.ones();
        var boxOfSize1AtOrigin = Box.fromSize(ones);
        var boxOfSize1AtXHalf = Box.fromSizeAndCenter(ones, new Coords(.5, 0, 0));
        var boxOfSize1AtX1 = Box.fromSizeAndCenter(ones, new Coords(1, 0, 0));
        var doBoxesOverlap = boxOfSize1AtOrigin.overlapsWith(boxOfSize1AtXHalf);
        Assert.isTrue(doBoxesOverlap);
        doBoxesOverlap =
            boxOfSize1AtOrigin.overlapsWith(boxOfSize1AtX1);
        Assert.isFalse(doBoxesOverlap);
    }
    overlapsWithXY() {
        var ones = Coords.ones();
        var boxOfSize1AtOrigin = Box.fromSize(ones);
        var boxOfSize1AtXHalfZTen = Box.fromSizeAndCenter(ones, new Coords(.5, 0, 10));
        var doBoxesOverlap = boxOfSize1AtOrigin.overlapsWithXY(boxOfSize1AtXHalfZTen);
        Assert.isTrue(doBoxesOverlap);
    }
    overlapsWithOtherInDimension() {
        var ones = Coords.ones();
        var boxOfSize1AtOrigin = Box.fromSize(ones);
        var boxOfSize1AtXHalfZTen = Box.fromSizeAndCenter(ones, new Coords(.5, 0, 10));
        var doBoxesOverlap = boxOfSize1AtOrigin.overlapsWithOtherInDimension(boxOfSize1AtXHalfZTen, 0);
        Assert.isTrue(doBoxesOverlap);
        doBoxesOverlap = boxOfSize1AtOrigin.overlapsWithOtherInDimension(boxOfSize1AtXHalfZTen, 1);
        Assert.isTrue(doBoxesOverlap);
        doBoxesOverlap = boxOfSize1AtOrigin.overlapsWithOtherInDimension(boxOfSize1AtXHalfZTen, 2);
        Assert.isFalse(doBoxesOverlap);
    }
    randomize() {
        var sizeBefore = Coords.ones();
        var centerBefore = Coords.zeroes();
        var boxBefore = Box.fromSizeAndCenter(sizeBefore.clone(), centerBefore.clone());
        var boxAfter = boxBefore.clone();
        boxAfter.randomize(null);
        Assert.isFalse(boxBefore.equals(boxAfter));
    }
    rangeForDimension() {
        var box = Box.fromSize(new Coords(1, 2, 3));
        var boxSize = box.size;
        var boxRangeX = box.rangeForDimension(0, RangeExtent.create());
        Assert.areEqual(boxRangeX.size(), boxSize.x);
        var boxRangeY = box.rangeForDimension(1, RangeExtent.create());
        Assert.areEqual(boxRangeY.size(), boxSize.y);
        var boxRangeZ = box.rangeForDimension(2, RangeExtent.create());
        Assert.areEqual(boxRangeZ.size(), boxSize.z);
    }
    sizeHalf() {
        throw new Error("Not yet implemented!");
    }
    sizeOverwriteWith() {
        throw new Error("Not yet implemented!");
    }
    touches() {
        throw new Error("Not yet implemented!");
    }
    touchesXY() {
        throw new Error("Not yet implemented!");
    }
    touchesOtherInDimension() {
        throw new Error("Not yet implemented!");
    }
    trimCoords() {
        throw new Error("Not yet implemented!");
    }
    vertices() {
        throw new Error("Not yet implemented!");
    }
    // Clonable.
    clone() {
        var boxToClone = Box.create().randomize(null);
        var boxCloned = boxToClone.clone();
        Assert.isTrue(boxToClone.equals(boxCloned));
    }
    equals() {
        var box0 = Box.create().randomize(null);
        var box1 = Box.create().randomize(null);
        Assert.isFalse(box0.equals(box1));
        box1.overwriteWith(box0);
        Assert.isTrue(box0.equals(box1));
    }
    overwriteWith() {
        var box0 = Box.create().randomize(null);
        var box1 = Box.create().randomize(null);
        Assert.isFalse(box0.equals(box1));
        box1.overwriteWith(box0);
        Assert.isTrue(box0.equals(box1));
    }
    // string
    toString() {
        var boxOfSize1AtOrigin = Box.fromSize(Coords.ones());
        var boxAsString = boxOfSize1AtOrigin.toString();
        var boxAsStringExpected = "-0.5x-0.5x-0.5:0.5x0.5x0.5";
        Assert.areEqual(boxAsStringExpected, boxAsString);
    }
    // ShapeBase.
    dimensionForSurfaceClosestToPoint() {
        throw new Error("Not yet implemented!");
    }
    normalAtPos() {
        var boxOfSize2AtOrigin = Box.fromSize(Coords.twos());
        var posToCheck = new Coords(1, 0, 0);
        var normalAtPosToCheck = boxOfSize2AtOrigin.normalAtPos(posToCheck, Coords.create());
        var normalExpected = new Coords(1, 0, 0);
        Assert.isTrue(normalExpected.equals(normalAtPosToCheck));
    }
    surfacePointNearPos() {
        var boxOfSize2AtOrigin = Box.fromSize(Coords.twos());
        var posToCheck = new Coords(1, 0, 0);
        var surfacePointAtPosToCheck = boxOfSize2AtOrigin.surfacePointNearPos(posToCheck, Coords.create());
        var surfacePointExpected = new Coords(1, 0, 0);
        Assert.isTrue(surfacePointExpected.equals(surfacePointAtPosToCheck));
    }
    toBox() {
        var box = Box.create().randomize(null);
        var boxAsBox = box.toBox(Box.create());
        Assert.isTrue(box.equals(boxAsBox));
    }
    // transformable
    coordsGroupToTranslate() {
        var box = Box.create().randomize(null);
        var boxCenter = box.center;
        var boxCoordsGroupToTranslate = box.coordsGroupToTranslate();
        Assert.isTrue(boxCoordsGroupToTranslate.length == 1);
        Assert.isTrue(boxCoordsGroupToTranslate[0] == boxCenter);
    }
    transform() {
        var box = Box.create().randomize(null);
        var boxCenterBeforeTransform = box.center.clone();
        var displacementToTranslate = Coords.create().randomize(null);
        var translateToApply = new Transform_Translate(displacementToTranslate);
        box.transform(translateToApply);
        var boxCenterAfterTransform = box.center;
        var boxDisplacement = boxCenterAfterTransform.clone().subtract(boxCenterBeforeTransform);
        Assert.isTrue(displacementToTranslate.equals(boxDisplacement));
    }
}
