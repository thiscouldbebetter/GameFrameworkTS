"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Disposition {
            constructor(pos, orientation, placeName) {
                this.pos = pos || GameFramework.Coords.create();
                if (orientation == null) {
                    orientation = GameFramework.Orientation.Instances().ForwardXDownZ.clone();
                }
                this.orientation = orientation;
                this.placeName = placeName;
                this.vel = GameFramework.Coords.create();
                this.accel = GameFramework.Coords.create();
                this.force = GameFramework.Coords.create();
                this.spin = new GameFramework.Rotation(this.orientation.down, new GameFramework.Reference(0));
                this.timeOffsetInTicks = 0;
            }
            static create() {
                return new Disposition(GameFramework.Coords.create(), GameFramework.Orientation.default(), null);
            }
            static default() {
                return Disposition.create();
            }
            static from2(pos, orientation) {
                return new Disposition(pos, orientation, null);
            }
            static fromOrientation(orientation) {
                return new Disposition(GameFramework.Coords.create(), orientation, null);
            }
            static fromPos(pos) {
                return new Disposition(pos, GameFramework.Orientation.default(), null);
            }
            static fromPosAndOrientation(pos, orientation) {
                return new Disposition(pos, orientation, null);
            }
            static fromPosAndVel(pos, vel) {
                var returnValue = Disposition.fromPos(pos);
                returnValue.vel = vel;
                return returnValue;
            }
            equals(other) {
                var returnValue = (this.placeName == other.placeName
                    && this.pos.equals(other.pos)
                    && this.orientation.equals(other.orientation));
                return returnValue;
            }
            place(world) {
                return world.placeByName(this.placeName);
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
