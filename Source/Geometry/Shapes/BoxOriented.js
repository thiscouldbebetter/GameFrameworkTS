"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class BoxOriented extends GameFramework.ShapeBase {
            constructor(center, ori, displacementFromCenterToCornerForwardRightDown) {
                super();
                this.center = center || GameFramework.Coords.create();
                this.ori = ori || GameFramework.Orientation.default();
                this.displacementFromCenterToCornerForwardRightDown =
                    displacementFromCenterToCornerForwardRightDown
                        || GameFramework.Coords.fromXYZ(1, 0, 0);
                this._displacement = GameFramework.Coords.create();
            }
            static create() {
                return new BoxOriented(GameFramework.Coords.create(), GameFramework.Orientation.default(), GameFramework.Coords.zeroZeroOne());
            }
            static default() {
                return BoxOriented.fromCenterAndSize(GameFramework.Coords.zeroes(), GameFramework.Coords.ones());
            }
            static fromCenterAndSize(center, size) {
                return new BoxOriented(center, GameFramework.Orientation.default(), size.clone().half());
            }
            static fromCenterOriAndDisplacementToCorner(center, ori, displacementFromCenterToCornerForwardRightDown) {
                return new BoxOriented(center, ori, displacementFromCenterToCornerForwardRightDown);
            }
            static fromSize(size) {
                return BoxOriented.fromCenterAndSize(GameFramework.Coords.zeroes(), size);
            }
            static fromSizeAndCenter(size, center) {
                return BoxOriented.fromCenterAndSize(center, size);
            }
            // Instance methods.
            cachedValuesClear() {
                this._corners = null;
                this._size = null;
                return this;
            }
            containsOther(other) {
                var cornersOfOther = other.corners();
                var cornersOfOtherAreNotAllContainedInThis = cornersOfOther.some(x => this.containsPoint(x) == false);
                var thisContainsAllCornersOfOther = (cornersOfOtherAreNotAllContainedInThis == false);
                return thisContainsAllCornersOfOther;
            }
            containsPoint(pointToCheck) {
                var displacementFromCenterToPointToCheck = this._displacement
                    .overwriteWith(pointToCheck)
                    .subtract(this.center);
                var pointToCheckProjectedOntoBoxAxes = this.ori.projectCoords(displacementFromCenterToPointToCheck);
                var sizeHalf = this.sizeHalf();
                var pointIsContained = pointToCheckProjectedOntoBoxAxes
                    .isInRangeMax(sizeHalf);
                return pointIsContained;
            }
            corners() {
                if (this._corners == null) {
                    var cornersRelative = [
                    //todo
                    ];
                    this._corners =
                        cornersRelative.map(x => x.add(this.center));
                }
                return this._corners;
            }
            size() {
                if (this._size == null) {
                    this._size =
                        this.displacementFromCenterToCornerForwardRightDown
                            .clone()
                            .double();
                }
                return this._size;
            }
            sizeHalf() {
                if (this._sizeHalf == null) {
                    this._sizeHalf = this.size().clone().half();
                }
                return this._sizeHalf;
            }
            // Clonable.
            clone() {
                return BoxOriented.fromCenterOriAndDisplacementToCorner(this.center.clone(), this.ori.clone(), this.displacementFromCenterToCornerForwardRightDown.clone());
            }
            overwriteWith(other) {
                this.center.overwriteWith(other.center);
                this.displacementFromCenterToCornerForwardRightDown
                    .overwriteWith(other.displacementFromCenterToCornerForwardRightDown);
                this.cachedValuesClear();
                return this;
            }
            // Equatable
            equals(other) {
                var returnValue = (this.center.equals(other.center)
                    && this.size().equals(other.size()));
                return returnValue;
            }
            // ShapeBase.
            pointRandom(randomizer) {
                var size = this.size();
                return this._displacement.randomize(randomizer).multiply(size);
                // todo - Orient it?
            }
            toBoxAxisAligned(boxOut) {
                var corners = this.corners();
                return boxOut.containPoints(corners);
            }
            // Transformable.
            transform(transformToApply) {
                transformToApply.transformCoords(this.center);
                transformToApply.transformCoords(this.displacementFromCenterToCornerForwardRightDown);
                var oriAxes = this.ori.axes;
                for (var i = 0; i < oriAxes.length; i++) {
                    var oriAxis = oriAxes[i];
                    transformToApply.transformCoords(oriAxis);
                }
                this.ori.normalize();
                return this;
            }
        }
        GameFramework.BoxOriented = BoxOriented;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
