"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Box {
            constructor(center, size) {
                this.center = center || GameFramework.Coords.create();
                this.size = size || GameFramework.Coords.create();
                this._sizeHalf = GameFramework.Coords.create();
                this._min = GameFramework.Coords.create();
                this._max = GameFramework.Coords.create();
                this._range = new GameFramework.RangeExtent(0, 0);
            }
            static create() {
                return new Box(null, null);
            }
            static fromMinAndMax(min, max) {
                var center = min.clone().add(max).half();
                var size = max.clone().subtract(min);
                return new Box(center, size);
            }
            static fromMinAndSize(min, size) {
                var center = size.clone().half().add(min);
                return new Box(center, size);
            }
            // Static methods.
            static doBoxesInSetsOverlap(boxSet0, boxSet1) {
                var doAnyBoxOverlapSoFar = false;
                for (var i = 0; i < boxSet0.length; i++) {
                    var boxFromSet0 = boxSet0[i];
                    for (var j = 0; j < boxSet1.length; j++) {
                        var boxFromSet1 = boxSet1[j];
                        doAnyBoxOverlapSoFar = boxFromSet0.overlapsWith(boxFromSet1);
                        if (doAnyBoxOverlapSoFar) {
                            break;
                        }
                    }
                }
                return doAnyBoxOverlapSoFar;
            }
            // Instance methods.
            containsOther(other) {
                return (this.containsPoint(other.min()) && this.containsPoint(other.max()));
            }
            containsPoint(pointToCheck) {
                return pointToCheck.isInRangeMinMax(this.min(), this.max());
            }
            fromMinAndMax(min, max) {
                this.center.overwriteWith(min).add(max).half();
                this.size.overwriteWith(max).subtract(min);
                return this;
            }
            intersectWith(other) {
                var thisMinDimensions = this.min().dimensions();
                var thisMaxDimensions = this.max().dimensions();
                var otherMinDimensions = other.min().dimensions();
                var otherMaxDimensions = other.max().dimensions();
                var rangesForDimensions = [new GameFramework.RangeExtent(0, 0), new GameFramework.RangeExtent(0, 0), new GameFramework.RangeExtent(0, 0)];
                var rangeOther = new GameFramework.RangeExtent(0, 0);
                var doAllDimensionsOverlapSoFar = true;
                for (var d = 0; d < rangesForDimensions.length; d++) {
                    var rangeThis = rangesForDimensions[d];
                    rangeThis.overwriteWithMinAndMax(thisMinDimensions[d], thisMaxDimensions[d]);
                    rangeOther.overwriteWithMinAndMax(otherMinDimensions[d], otherMaxDimensions[d]);
                    var doesDimensionOverlap = rangeThis.overlapsWith(rangeOther);
                    if (doesDimensionOverlap) {
                        rangeThis.intersectWith(rangeOther);
                    }
                    else {
                        doAllDimensionsOverlapSoFar = false;
                        break;
                    }
                }
                var returnValue = null;
                if (doAllDimensionsOverlapSoFar) {
                    var center = GameFramework.Coords.create();
                    var size = GameFramework.Coords.create();
                    for (var d = 0; d < rangesForDimensions.length; d++) {
                        var rangeForDimension = rangesForDimensions[d];
                        center.dimensionSet(d, rangeForDimension.midpoint());
                        size.dimensionSet(d, rangeForDimension.size());
                    }
                    returnValue = new Box(center, size);
                }
                return returnValue;
            }
            locate(loc) {
                this.center.overwriteWith(loc.pos);
                return this;
            }
            max() {
                return this._max.overwriteWith(this.center).add(this.sizeHalf());
            }
            min() {
                return this._min.overwriteWith(this.center).subtract(this.sizeHalf());
            }
            ofPoints(points) {
                var point0 = points[0];
                var minSoFar = this._min.overwriteWith(point0);
                var maxSoFar = this._max.overwriteWith(point0);
                for (var i = 1; i < points.length; i++) {
                    var point = points[i];
                    if (point.x < minSoFar.x) {
                        minSoFar.x = point.x;
                    }
                    else if (point.x > maxSoFar.x) {
                        maxSoFar.x = point.x;
                    }
                    if (point.y < minSoFar.y) {
                        minSoFar.y = point.y;
                    }
                    else if (point.y > maxSoFar.y) {
                        maxSoFar.y = point.y;
                    }
                    if (point.z < minSoFar.z) {
                        minSoFar.z = point.z;
                    }
                    else if (point.z > maxSoFar.z) {
                        maxSoFar.z = point.z;
                    }
                }
                this.center.overwriteWith(minSoFar).add(maxSoFar).half();
                this.size.overwriteWith(maxSoFar).subtract(minSoFar);
                return this;
            }
            overlapsWith(other) {
                var returnValue = (this.overlapsWithOtherInDimension(other, 0)
                    && this.overlapsWithOtherInDimension(other, 1)
                    && this.overlapsWithOtherInDimension(other, 2));
                return returnValue;
            }
            overlapsWithXY(other) {
                var returnValue = (this.overlapsWithOtherInDimension(other, 0)
                    && this.overlapsWithOtherInDimension(other, 1));
                return returnValue;
            }
            overlapsWithOtherInDimension(other, dimensionIndex) {
                var rangeThis = this.rangeForDimension(dimensionIndex, this._range);
                var rangeOther = other.rangeForDimension(dimensionIndex, other._range);
                var returnValue = rangeThis.overlapsWith(rangeOther);
                return returnValue;
            }
            rangeForDimension(dimensionIndex, rangeOut) {
                rangeOut.min = this.min().dimensionGet(dimensionIndex);
                rangeOut.max = this.max().dimensionGet(dimensionIndex);
                return rangeOut;
            }
            sizeHalf() {
                return this._sizeHalf.overwriteWith(this.size).half();
            }
            sizeOverwriteWith(sizeOther) {
                this.size.overwriteWith(sizeOther);
                return this;
            }
            touches(other) {
                var returnValue = (this.touchesOtherInDimension(other, 0)
                    && this.touchesOtherInDimension(other, 1)
                    && this.touchesOtherInDimension(other, 2));
                return returnValue;
            }
            touchesXY(other) {
                var returnValue = (this.touchesOtherInDimension(other, 0)
                    && this.touchesOtherInDimension(other, 1));
                return returnValue;
            }
            touchesOtherInDimension(other, dimensionIndex) {
                var rangeThis = this.rangeForDimension(dimensionIndex, this._range);
                var rangeOther = other.rangeForDimension(dimensionIndex, other._range);
                var returnValue = rangeThis.touches(rangeOther);
                return returnValue;
            }
            trimCoords(coordsToTrim) {
                return coordsToTrim.trimToRangeMinMax(this.min(), this.max());
            }
            vertices() {
                if (this._vertices == null) {
                    this._vertices = [];
                    // todo
                }
                return this._vertices;
            }
            // cloneable
            clone() {
                return new Box(this.center.clone(), this.size.clone());
            }
            overwriteWith(other) {
                this.center.overwriteWith(other.center);
                this.size.overwriteWith(other.size);
                return this;
            }
            // string
            toString() {
                return this.min().toString() + ":" + this.max().toString();
            }
            // transformable
            coordsGroupToTranslate() {
                return [this.center];
            }
            transform(transformToApply) {
                GameFramework.Transforms.applyTransformToCoordsMany(transformToApply, this.coordsGroupToTranslate());
                return this;
            }
            // ShapeBase.
            dimensionForSurfaceClosestToPoint(posToCheck, displacementOverSizeHalf) {
                var greatestAbsoluteDisplacementDimensionSoFar = -1;
                var dimensionIndex = null;
                for (var d = 0; d < 3; d++) // dimension
                 {
                    var displacementDimensionOverSizeHalf = displacementOverSizeHalf.dimensionGet(d);
                    var displacementDimensionOverSizeHalfAbsolute = Math.abs(displacementDimensionOverSizeHalf);
                    if (displacementDimensionOverSizeHalfAbsolute
                        > greatestAbsoluteDisplacementDimensionSoFar) {
                        greatestAbsoluteDisplacementDimensionSoFar =
                            displacementDimensionOverSizeHalfAbsolute;
                        dimensionIndex = d;
                    }
                }
                return dimensionIndex;
            }
            normalAtPos(posToCheck, normalOut) {
                var displacementOverSizeHalf = normalOut.overwriteWith(posToCheck).subtract(this.center).divide(this.sizeHalf());
                var dimensionIndex = this.dimensionForSurfaceClosestToPoint(posToCheck, displacementOverSizeHalf);
                var displacementDimensionOverSizeHalf = displacementOverSizeHalf.dimensionGet(dimensionIndex);
                var multiplier = (displacementDimensionOverSizeHalf > 0 ? 1 : -1);
                normalOut.clear().dimensionSet(dimensionIndex, 1).multiplyScalar(multiplier);
                return normalOut;
            }
            surfacePointNearPos(posToCheck, surfacePointOut) {
                return surfacePointOut.overwriteWith(posToCheck); // todo
            }
        }
        GameFramework.Box = Box;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
