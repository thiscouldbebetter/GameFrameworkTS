"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Vehicle extends GameFramework.EntityPropertyBase {
            constructor(accelerationPerTick, speedMax, steeringAngleInTurns) {
                super();
                this.accelerationPerTick = accelerationPerTick;
                this.speedMax = speedMax;
                this.steeringAngleInTurns = steeringAngleInTurns;
                this.entityOccupant = null;
                this.steeringDirection = 0;
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Vehicle.name; }
            updateForTimerTick(uwpe) {
                if (this.entityOccupant != null) {
                    var universe = uwpe.universe;
                    var world = uwpe.world;
                    var place = uwpe.place;
                    var entityVehicle = uwpe.entity;
                    var placeDefn = place.defn(world);
                    var actionsByName = placeDefn.actionsByName;
                    var inputHelper = universe.inputHelper;
                    var actionsToPerform = inputHelper.actionsFromInput(actionsByName, placeDefn.actionToInputsMappingsByInputName);
                    var vehicle = entityVehicle.propertiesByName.get(Vehicle.name);
                    vehicle.steeringDirection = 0;
                    var vehicleLoc = GameFramework.Locatable.of(entityVehicle).loc;
                    var vehicleOrientation = vehicleLoc.orientation;
                    var vehicleForward = vehicleOrientation.forward;
                    var vehicleRight = vehicleOrientation.right;
                    var vehicleVel = vehicleLoc.vel;
                    var vehicleSpeed = vehicleVel.magnitude();
                    var isAccelerating = false;
                    for (var i = 0; i < actionsToPerform.length; i++) {
                        var action = actionsToPerform[i];
                        var actionName = action.name;
                        // todo
                        if (actionName == "MoveUp") {
                            isAccelerating = true;
                        }
                        else if (actionName == "MoveLeft") {
                            vehicle.steeringDirection = -1;
                        }
                        else if (actionName == "MoveRight") {
                            vehicle.steeringDirection = 1;
                        }
                        else if (actionName == "Use") {
                            var occupantLoc = GameFramework.Locatable.of(this.entityOccupant).loc;
                            occupantLoc.pos.overwriteWith(vehicleLoc.pos);
                            occupantLoc.vel.clear();
                            place.entityToSpawnAdd(this.entityOccupant);
                            this.entityOccupant = null;
                        }
                    }
                    if (isAccelerating) {
                        vehicleLoc.accel.overwriteWith(vehicleForward).multiplyScalar(this.accelerationPerTick);
                    }
                    if (vehicleSpeed > 0) {
                        vehicleOrientation.forwardSet(vehicleVel.clone().normalize());
                        var vehicleSpeedOverMax = vehicleSpeed / this.speedMax;
                        var steeringFactor = .5;
                        vehicleLoc.accel.add(vehicleRight.clone().multiplyScalar(vehicle.steeringDirection * steeringFactor * vehicleSpeedOverMax));
                    }
                    vehicleVel.trimToMagnitudeMax(this.speedMax);
                }
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Vehicle = Vehicle;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
