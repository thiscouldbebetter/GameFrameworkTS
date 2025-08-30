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
                this.placeNameSet(placeName);
                this.vel = GameFramework.Coords.create();
                this.accel = GameFramework.Coords.create();
                this.force = GameFramework.Coords.create();
                this.spin = new GameFramework.Rotation(this.orientation.down, new GameFramework.Reference(0));
                this.timeOffsetInTicks = 0;
                this._accelDirection = GameFramework.Coords.create();
                this._velDirection = GameFramework.Coords.create();
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
                return new Disposition(GameFramework.Coords.zeroes(), orientation, null);
            }
            static fromPos(pos) {
                return new Disposition(pos, GameFramework.Orientation.default(), null);
            }
            static fromPosAndOri(pos, ori) {
                return new Disposition(pos, ori, null);
            }
            static fromPosAndOrientation(pos, ori) {
                return new Disposition(pos, ori, null);
            }
            static fromPosAndVel(pos, vel) {
                var returnValue = Disposition.fromPos(pos);
                returnValue.vel = vel;
                return returnValue;
            }
            static fromPosOrientationAndPlaceName(pos, orientation, placeName) {
                return new Disposition(pos, orientation, placeName);
            }
            accelDirection() {
                return this._accelDirection.overwriteWith(this.accel).normalize();
            }
            clear() {
                this.pos.clear();
                this.vel.clear();
                this.accel.clear();
                this.force.clear();
                return this;
            }
            equals(other) {
                var placeName = this.placeName();
                var otherPlaceName = other.placeName();
                var returnValue = (placeName == otherPlaceName
                    && this.pos.equals(other.pos)
                    && this.orientation.equals(other.orientation));
                return returnValue;
            }
            place(world) {
                var placeName = this.placeName();
                return world.placeGetByName(placeName);
            }
            placeName() {
                return this._placeName;
            }
            placeNameSet(value) {
                this._placeName = value;
                return this;
            }
            velDirection() {
                return this._velDirection.overwriteWith(this.vel).normalize();
            }
            velSet(value) {
                this.vel.overwriteWith(value);
                return this;
            }
            // Clonable.
            clone() {
                var returnValue = new Disposition(this.pos.clone(), this.orientation.clone(), this.placeName());
                returnValue.vel = this.vel.clone();
                returnValue.accel = this.accel.clone();
                returnValue.force = this.force.clone();
                returnValue.spin = this.spin.clone();
                returnValue.timeOffsetInTicks = this.timeOffsetInTicks;
                return returnValue;
            }
            overwriteWith(other) {
                var otherPlaceName = other.placeName();
                this.placeNameSet(otherPlaceName);
                this.pos.overwriteWith(other.pos);
                this.orientation.overwriteWith(other.orientation);
                this.vel.overwriteWith(other.vel);
                this.accel.overwriteWith(other.accel);
                this.force.overwriteWith(other.force);
                this.spin.overwriteWith(other.spin);
                this.timeOffsetInTicks = other.timeOffsetInTicks;
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
