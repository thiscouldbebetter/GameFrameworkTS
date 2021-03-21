"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Disposition {
            constructor(pos, orientation, placeName) {
                this.pos = pos || GameFramework.Coords.blank();
                if (orientation == null) {
                    orientation = GameFramework.Orientation.Instances().ForwardXDownZ.clone();
                }
                this.orientation = orientation;
                this.placeName = placeName;
                this.vel = GameFramework.Coords.blank();
                this.accel = GameFramework.Coords.blank();
                this.force = GameFramework.Coords.blank();
                this.spin = new GameFramework.Rotation(this.orientation.down, new GameFramework.Reference(0));
                this.timeOffsetInTicks = 0;
            }
            static blank() {
                return new Disposition(null, null, null);
            }
            static fromPos(pos) {
                return new Disposition(pos, null, null);
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
