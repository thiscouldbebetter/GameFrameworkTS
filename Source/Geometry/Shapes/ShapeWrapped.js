"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeWrapped extends GameFramework.ShapeBase {
            constructor(sizeInWrappedInstances, sizeToWrapTo, child) {
                super();
                this.sizeInWrappedInstances = sizeInWrappedInstances;
                this.sizeToWrapTo = sizeToWrapTo;
                this.child = child;
            }
            static fromSizeInWrappedInstancesSizeToWrapToAndChild(sizeInWrappedInstances, sizeToWrapTo, child) {
                return new ShapeWrapped(sizeInWrappedInstances, sizeToWrapTo, child);
            }
            toShapeGroupAny() {
                if (this._shapeGroupAny == null) {
                    var displacement = GameFramework.Coords.create();
                    var shapesWrapped = [];
                    var offsetInWraps = GameFramework.Coords.create();
                    var sizeInWrappedInstancesHalf = this.sizeInWrappedInstances.clone().half().floor();
                    for (var z = 0; z < this.sizeInWrappedInstances.z; z++) {
                        offsetInWraps.z = z - sizeInWrappedInstancesHalf.z;
                        for (var y = 0; y < this.sizeInWrappedInstances.y; y++) {
                            offsetInWraps.y = y - sizeInWrappedInstancesHalf.y;
                            for (var x = 0; x < this.sizeInWrappedInstances.x; x++) {
                                offsetInWraps.x = x - sizeInWrappedInstancesHalf.x;
                                displacement
                                    .overwriteWith(offsetInWraps)
                                    .multiply(this.sizeToWrapTo);
                                var transformTranslate = GameFramework.Transform_Translate.fromDisplacement(displacement.clone());
                                var shapeTransformed = GameFramework.ShapeTransformed.fromTransformAndChild(transformTranslate, this.child);
                                shapesWrapped.push(shapeTransformed);
                            }
                        }
                    }
                    this._shapeGroupAny = GameFramework.ShapeGroupAny.fromChildren(shapesWrapped);
                }
                return this._shapeGroupAny;
            }
            // Clonable.
            clone() {
                return new ShapeWrapped(this.sizeInWrappedInstances.clone(), this.sizeToWrapTo.clone(), this.child.clone());
            }
            overwriteWith(other) {
                var thisAsShapeGroupAny = this.toShapeGroupAny();
                var otherAsShapeGroupAny = other.toShapeGroupAny();
                thisAsShapeGroupAny.overwriteWith(otherAsShapeGroupAny);
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                this.child.transform(transformToApply); // Is this correct?
                return this;
            }
        }
        GameFramework.ShapeWrapped = ShapeWrapped;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
