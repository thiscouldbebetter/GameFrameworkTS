"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Coords {
            constructor(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
                if (this.z == null) {
                    this.z = 0;
                }
            }
            static Instances() {
                if (Coords._instances == null) {
                    Coords._instances = new Coords_Instances();
                }
                return Coords._instances;
            }
            // methods
            static blank() {
                return new Coords(0, 0, 0);
            }
            static fromXY(x, y) {
                return new Coords(x, y, 0);
            }
            absolute() {
                this.x = Math.abs(this.x);
                this.y = Math.abs(this.y);
                this.z = Math.abs(this.z);
                return this;
            }
            add(other) {
                this.x += other.x;
                this.y += other.y;
                this.z += other.z;
                return this;
            }
            addDimensions(x, y, z) {
                this.x += x;
                this.y += y;
                this.z += z;
                return this;
            }
            ceiling() {
                this.x = Math.ceil(this.x);
                this.y = Math.ceil(this.y);
                this.z = Math.ceil(this.z);
                return this;
            }
            clear() {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                return this;
            }
            clearZ() {
                this.z = 0;
                return this;
            }
            clone() {
                return new Coords(this.x, this.y, this.z);
            }
            crossProduct(other) {
                return this.overwriteWithDimensions(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
            }
            dimensionGet(dimensionIndex) {
                var returnValue;
                if (dimensionIndex == 0) {
                    returnValue = this.x;
                }
                else if (dimensionIndex == 1) {
                    returnValue = this.y;
                }
                else if (dimensionIndex == 2) {
                    returnValue = this.z;
                }
                return returnValue;
            }
            dimensionSet(dimensionIndex, valueToSet) {
                if (dimensionIndex == 0) {
                    this.x = valueToSet;
                }
                else if (dimensionIndex == 1) {
                    this.y = valueToSet;
                }
                else if (dimensionIndex == 2) {
                    this.z = valueToSet;
                }
                return this;
            }
            dimensions() {
                return [this.x, this.y, this.z];
            }
            directions() {
                if (this.x < 0) {
                    this.x = -1;
                }
                else if (this.x > 0) {
                    this.x = 1;
                }
                if (this.y < 0) {
                    this.y = -1;
                }
                else if (this.y > 0) {
                    this.y = 1;
                }
                if (this.z < 0) {
                    this.z = -1;
                }
                else if (this.z > 0) {
                    this.z = 1;
                }
                return this;
            }
            divide(other) {
                this.x /= other.x;
                this.y /= other.y;
                this.z /= other.z;
                return this;
            }
            divideScalar(scalar) {
                this.x /= scalar;
                this.y /= scalar;
                this.z /= scalar;
                return this;
            }
            dotProduct(other) {
                return this.x * other.x + this.y * other.y + this.z * other.z;
            }
            double() {
                return this.multiplyScalar(2);
            }
            equals(other) {
                return (this.x == other.x && this.y == other.y && this.z == other.z);
            }
            equalsXY(other) {
                return (this.x == other.x && this.y == other.y);
            }
            floor() {
                this.x = Math.floor(this.x);
                this.y = Math.floor(this.y);
                this.z = Math.floor(this.z);
                return this;
            }
            fromHeadingInTurns(headingInTurns) {
                var headingInRadians = headingInTurns * GameFramework.Polar.RadiansPerTurn;
                this.x = Math.cos(headingInRadians);
                this.y = Math.sin(headingInRadians);
                return this;
            }
            half() {
                return this.divideScalar(2);
            }
            headingInTurns() {
                var returnValue;
                if (this.x == 0 && this.y == 0) {
                    returnValue = null;
                }
                else {
                    returnValue = Math.atan2(this.y, this.x) / (Math.PI * 2);
                    if (returnValue < 0) {
                        returnValue += 1;
                    }
                    returnValue = GameFramework.NumberHelper.wrapToRangeMinMax(returnValue, 0, 1);
                }
                return returnValue;
            }
            ;
            invert() {
                this.x = 0 - this.x;
                this.y = 0 - this.y;
                this.z = 0 - this.z;
                return this;
            }
            isInRangeMax(max) {
                return this.isInRangeMinMax(Coords.Instances().Zeroes, max);
            }
            isInRangeMaxExclusive(max) {
                return this.isInRangeMinInclusiveMaxExclusive(Coords.Instances().Zeroes, max);
            }
            isInRangeMinMax(min, max) {
                var returnValue = (this.x >= min.x
                    && this.x <= max.x
                    && this.y >= min.y
                    && this.y <= max.y
                    && this.z >= min.z
                    && this.z <= max.z);
                return returnValue;
            }
            isInRangeMinInclusiveMaxExclusive(min, max) {
                var returnValue = (this.x >= min.x
                    && this.x < max.x
                    && this.y >= min.y
                    && this.y < max.y
                    && this.z >= min.z
                    && this.z < max.z);
                return returnValue;
            }
            magnitude() {
                return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            }
            multiply(other) {
                this.x *= other.x;
                this.y *= other.y;
                this.z *= other.z;
                return this;
            }
            multiplyDimensions(x, y, z) {
                this.x *= x;
                this.y *= y;
                this.z *= z;
                return this;
            }
            multiplyScalar(scalar) {
                this.x *= scalar;
                this.y *= scalar;
                this.z *= scalar;
                return this;
            }
            normalize() {
                var magnitude = this.magnitude();
                if (magnitude > 0) {
                    this.divideScalar(magnitude);
                }
                return this;
            }
            overwriteWith(other) {
                this.x = other.x;
                this.y = other.y;
                this.z = other.z;
                return this;
            }
            overwriteWithDimensions(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
                return this;
            }
            overwriteWithXY(other) {
                this.x = other.x;
                this.y = other.y;
                return this;
            }
            productOfDimensions() {
                return this.x * this.y * this.z;
            }
            randomize(randomizer) {
                if (randomizer == null) {
                    randomizer = new GameFramework.RandomizerSystem();
                }
                this.x = randomizer.getNextRandom();
                this.y = randomizer.getNextRandom();
                this.z = randomizer.getNextRandom();
                return this;
            }
            right() {
                var temp = this.y;
                this.y = this.x;
                this.x = 0 - temp;
                return this;
            }
            round() {
                this.x = Math.round(this.x);
                this.y = Math.round(this.y);
                this.z = Math.round(this.z);
                return this;
            }
            subtract(other) {
                this.x -= other.x;
                this.y -= other.y;
                this.z -= other.z;
                return this;
            }
            subtractWrappedToRangeMax(other, max) {
                this.x = GameFramework.NumberHelper.subtractWrappedToRangeMax(this.x, other.x, max.x);
                this.y = GameFramework.NumberHelper.subtractWrappedToRangeMax(this.y, other.y, max.y);
                this.z = GameFramework.NumberHelper.subtractWrappedToRangeMax(this.z, other.z, max.z);
                return this;
            }
            sumOfDimensions() {
                return this.x + this.y + this.z;
            }
            trimToMagnitudeMax(magnitudeMax) {
                var magnitude = this.magnitude();
                if (magnitude > magnitudeMax) {
                    this.divideScalar(magnitude).multiplyScalar(magnitudeMax);
                }
                return this;
            }
            trimToRangeMax(max) {
                if (this.x < 0) {
                    this.x = 0;
                }
                else if (this.x > max.x) {
                    this.x = max.x;
                }
                if (this.y < 0) {
                    this.y = 0;
                }
                else if (this.y > max.y) {
                    this.y = max.y;
                }
                if (this.z < 0) {
                    this.z = 0;
                }
                else if (this.z > max.z) {
                    this.z = max.z;
                }
                return this;
            }
            trimToRangeMinMax(min, max) {
                if (this.x < min.x) {
                    this.x = min.x;
                }
                else if (this.x >= max.x) {
                    this.x = max.x;
                }
                if (this.y < min.y) {
                    this.y = min.y;
                }
                else if (this.y >= max.y) {
                    this.y = max.y;
                }
                if (this.z < min.z) {
                    this.z = min.z;
                }
                else if (this.z >= max.z) {
                    this.z = max.z;
                }
                return this;
            }
            wrapToRangeMax(max) {
                while (this.x < 0) {
                    this.x += max.x;
                }
                while (this.x >= max.x) {
                    this.x -= max.x;
                }
                while (this.y < 0) {
                    this.y += max.y;
                }
                while (this.y >= max.y) {
                    this.y -= max.y;
                }
                if (max.z > 0) {
                    while (this.z < 0) {
                        this.z += max.z;
                    }
                    while (this.z >= max.z) {
                        this.z -= max.z;
                    }
                }
                return this;
            }
            xSet(value) {
                this.x = value;
                return this;
            }
            ySet(value) {
                this.y = value;
                return this;
            }
            zSet(value) {
                this.z = value;
                return this;
            }
            // string
            toString() {
                return this.x + "x" + this.y + "x" + this.z;
            }
            toStringXY() {
                return this.x + "x" + this.y;
            }
        }
        // constants
        Coords.NumberOfDimensions = 3;
        GameFramework.Coords = Coords;
        class Coords_Instances {
            constructor() {
                this.HalfHalfZero = new Coords(.5, .5, 0);
                this.Halves = new Coords(.5, .5, .5);
                this.MinusOneZeroZero = new Coords(-1, 0, 0);
                this.Ones = new Coords(1, 1, 1);
                this.OneOneZero = new Coords(1, 1, 0);
                this.OneZeroZero = new Coords(1, 0, 0);
                this.TwoTwoZero = new Coords(2, 2, 0);
                this.ZeroZeroOne = new Coords(0, 0, 1);
                this.ZeroMinusOneZero = new Coords(0, -1, 0);
                this.ZeroOneZero = new Coords(0, 1, 0);
                this.Zeroes = Coords.blank();
            }
        }
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
