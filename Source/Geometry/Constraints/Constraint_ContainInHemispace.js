"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Constraint_ContainInHemispace extends GameFramework.ConstraintBase {
            constructor(hemispaceToContainWithin) {
                super();
                this.hemispaceToContainWithin = hemispaceToContainWithin;
                this._coordsTemp = GameFramework.Coords.create();
            }
            static fromHemispace(hemispaceToContainWithin) {
                return new Constraint_ContainInHemispace(hemispaceToContainWithin);
            }
            constrain(uwpe) {
                var entity = uwpe.entity;
                var hemispace = this.hemispaceToContainWithin;
                var plane = hemispace.plane;
                var loc = GameFramework.Locatable.of(entity).loc;
                var pos = loc.pos;
                // Can't use Hemispace.trimCoords(),
                // because we also need to trim velocity and acceleration.
                var distanceOfPointAbovePlane = plane.distanceToPointAlongNormal(pos);
                var areCoordsOutsideHemispace = (distanceOfPointAbovePlane > 0);
                if (areCoordsOutsideHemispace) {
                    var planeNormal = plane.normal;
                    pos.subtract(this._coordsTemp
                        .overwriteWith(planeNormal)
                        .multiplyScalar(distanceOfPointAbovePlane));
                    var vel = loc.vel;
                    var speedAlongNormal = vel.dotProduct(planeNormal);
                    if (speedAlongNormal > 0) {
                        vel.subtract(this._coordsTemp.
                            overwriteWith(planeNormal)
                            .multiplyScalar(speedAlongNormal));
                    }
                    var accel = loc.accel;
                    var accelerationAlongNormal = accel.dotProduct(planeNormal);
                    if (accelerationAlongNormal > 0) {
                        accel.subtract(this._coordsTemp
                            .overwriteWith(planeNormal)
                            .multiplyScalar(accelerationAlongNormal));
                    }
                }
            }
        }
        GameFramework.Constraint_ContainInHemispace = Constraint_ContainInHemispace;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
