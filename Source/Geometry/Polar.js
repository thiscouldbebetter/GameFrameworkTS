"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Polar {
            constructor(azimuthInTurns, radius, elevationInTurns) {
                this.azimuthInTurns = azimuthInTurns;
                this.radius = radius;
                this.elevationInTurns = (elevationInTurns == null ? 0 : elevationInTurns);
            }
            static create() {
                return new Polar(0, 0, 0);
            }
            static default() {
                return new Polar(0, 1, 0);
            }
            static fromAzimuthInTurns(azimuthInTurns) {
                return new Polar(azimuthInTurns, 1, 0);
            }
            static fromAzimuthInTurnsAndRadius(azimuthInTurns, radius) {
                return new Polar(azimuthInTurns, radius, 0);
            }
            static fromRadius(radius) {
                return new Polar(0, radius, 0);
            }
            static random2D() {
                return new Polar(Math.random(), Math.random(), 0);
            }
            // instance methods
            addToAzimuthInTurns(turnsToAdd) {
                this.azimuthInTurns += turnsToAdd;
                return this;
            }
            fromCoords(coordsToConvert) {
                this.azimuthInTurns =
                    Math.atan2(coordsToConvert.y, coordsToConvert.x)
                        / Polar.RadiansPerTurn;
                if (this.azimuthInTurns < 0) {
                    this.azimuthInTurns += 1;
                }
                this.radius = coordsToConvert.magnitude();
                if (this.radius == 0) {
                    this.elevationInTurns = 0;
                }
                else {
                    this.elevationInTurns =
                        Math.asin(coordsToConvert.z / this.radius)
                            / Polar.RadiansPerTurn;
                }
                return this;
            }
            overwriteCoords(coords) {
                var azimuthInRadians = this.azimuthInTurns * Polar.RadiansPerTurn;
                var elevationInRadians = this.elevationInTurns * Polar.RadiansPerTurn;
                var cosineOfElevation = Math.cos(elevationInRadians);
                coords.overwriteWithDimensions(Math.cos(azimuthInRadians) * cosineOfElevation, Math.sin(azimuthInRadians) * cosineOfElevation, Math.sin(elevationInRadians)).multiplyScalar(this.radius);
                return coords;
            }
            overwriteWith(other) {
                this.azimuthInTurns = other.azimuthInTurns;
                this.radius = other.radius;
                this.elevationInTurns = other.elevationInTurns;
                return this;
            }
            overwriteWithAzimuthRadiusElevation(azimuthInTurns, radius, elevationInTurns) {
                this.azimuthInTurns = azimuthInTurns;
                this.radius = radius;
                if (elevationInTurns != null) {
                    this.elevationInTurns = elevationInTurns;
                }
                return this;
            }
            random(randomizer) {
                if (randomizer == null) {
                    randomizer = new GameFramework.RandomizerSystem();
                }
                this.azimuthInTurns = randomizer.fraction();
                this.elevationInTurns = randomizer.fraction();
                return this;
            }
            radiusSet(value) {
                this.radius = value;
                return this;
            }
            toCoords() {
                return this.overwriteCoords(GameFramework.Coords.create());
            }
            wrap() {
                while (this.azimuthInTurns < 0) {
                    this.azimuthInTurns++;
                }
                while (this.azimuthInTurns >= 1) {
                    this.azimuthInTurns--;
                }
                return this;
            }
            // Clonable.
            clone() {
                return new Polar(this.azimuthInTurns, this.radius, this.elevationInTurns);
            }
        }
        // constants
        Polar.DegreesPerTurn = 360;
        Polar.RadiansPerTurn = Math.PI * 2;
        GameFramework.Polar = Polar;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
