"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Disposition {
            constructor(pos, orientation, placeName) {
                this.pos = pos || new GameFramework.Coords(0, 0, 0);
                if (orientation == null) {
                    orientation = GameFramework.Orientation.Instances().ForwardXDownZ.clone();
                }
                this.orientation = orientation;
                this.placeName = placeName;
                this.vel = new GameFramework.Coords(0, 0, 0);
                this.accel = new GameFramework.Coords(0, 0, 0);
                this.force = new GameFramework.Coords(0, 0, 0);
                this.spin = new GameFramework.Rotation(this.orientation.down, new GameFramework.Reference(0));
                this.timeOffsetInTicks = 0;
            }
            place(world) {
                return world.placesByName.get(this.placeName);
            }
            velSet(value) {
                this.vel.overwriteWith(value);
                return this;
            }
            // cloneable
            clone() {
                var returnValue = new Disposition(this.pos.clone(), this.orientation.clone(), this.placeName);
                returnValue.vel = this.vel.clone();
                returnValue.accel = this.accel.clone();
                returnValue.force = this.force.clone();
                returnValue.timeOffsetInTicks = this.timeOffsetInTicks;
                return returnValue;
            }
            overwriteWith(other) {
                this.placeName = other.placeName;
                this.pos.overwriteWith(other.pos);
                this.orientation.overwriteWith(other.orientation);
                this.vel.overwriteWith(other.vel);
                this.accel.overwriteWith(other.accel);
                this.force.overwriteWith(other.force);
                return this;
            }
            // strings
            toString() {
                return this.pos.clone().round().toString();
            }
        }
        GameFramework.Disposition = Disposition;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
