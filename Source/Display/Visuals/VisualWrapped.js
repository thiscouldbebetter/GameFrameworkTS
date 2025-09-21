"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualWrapped extends GameFramework.VisualBase {
            constructor(sizeInWrappedInstances, child) {
                super();
                this.sizeInWrappedInstances =
                    sizeInWrappedInstances || GameFramework.Coords.ones();
                this.child = child;
                this._entityPosToRestore = GameFramework.Coords.create();
                this._sizeInWrappedInstancesHalfRoundedDown = GameFramework.Coords.create();
                this._wrapOffsetInPixels = GameFramework.Coords.create();
                this._wrapOffsetInWraps = GameFramework.Coords.create();
            }
            static fromSizeInWrappedInstancesAndChild(sizeInWrappedInstances, child) {
                return new VisualWrapped(sizeInWrappedInstances, child);
            }
            sizeInWrappedInstancesHalfRoundedDown() {
                this._sizeInWrappedInstancesHalfRoundedDown
                    .overwriteWith(this.sizeInWrappedInstances)
                    .half()
                    .floor();
                return this._sizeInWrappedInstancesHalfRoundedDown;
            }
            sizeInWrappedInstancesSet(value) {
                this.sizeInWrappedInstances = value;
                return this;
            }
            draw(uwpe, display) {
                var sizeInWraps = this.sizeInWrappedInstances;
                var sizeInWrapsHalfRoundedDown = this.sizeInWrappedInstancesHalfRoundedDown();
                var place = uwpe.place;
                var wrapSizeInPixels = place.size();
                var entity = uwpe.entity;
                var entityPos = GameFramework.Locatable.of(entity).loc.pos;
                var wrapOffsetInWraps = this._wrapOffsetInWraps;
                var wrapOffsetInPixels = this._wrapOffsetInPixels;
                for (var z = 0; z < sizeInWraps.z; z++) {
                    wrapOffsetInWraps.z =
                        z - sizeInWrapsHalfRoundedDown.z;
                    for (var y = 0; y < sizeInWraps.y; y++) {
                        wrapOffsetInWraps.y =
                            y - sizeInWrapsHalfRoundedDown.y;
                        for (var x = 0; x < sizeInWraps.x; x++) {
                            wrapOffsetInWraps.x =
                                x - sizeInWrapsHalfRoundedDown.x;
                            this._entityPosToRestore.overwriteWith(entityPos);
                            wrapOffsetInPixels
                                .overwriteWith(wrapOffsetInWraps)
                                .multiply(wrapSizeInPixels);
                            entityPos.add(wrapOffsetInPixels);
                            this.child.draw(uwpe, uwpe.universe.display);
                            entityPos.overwriteWith(this._entityPosToRestore);
                        }
                    }
                }
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
        }
        GameFramework.VisualWrapped = VisualWrapped;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
