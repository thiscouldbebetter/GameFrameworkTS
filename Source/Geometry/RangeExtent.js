"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class RangeExtent {
            constructor(min, max) {
                this.min = min;
                this.max = max;
            }
            static create() {
                return new RangeExtent(0, 0);
            }
            static fromNumber(value) {
                return new RangeExtent(value, value);
            }
            static Instances() {
                if (RangeExtent._instances == null) {
                    RangeExtent._instances = new RangeExtent_Instances();
                }
                return RangeExtent._instances;
            }
            clone() {
                return new RangeExtent(this.min, this.max);
            }
            contains(valueToCheck) {
                return (valueToCheck >= this.min && valueToCheck <= this.max);
            }
            intersectWith(other) {
                this.min = (this.min >= other.min ? this.min : other.min);
                this.max = (this.max <= other.max ? this.max : other.max);
                return this;
            }
            midpoint() {
                return (this.min + this.max) / 2;
            }
            minAndMax() {
                return [this.min, this.max];
            }
            overlapsWith(other) {
                var returnValue = (this.min < other.max
                    && this.max > other.min);
                return returnValue;
            }
            overwriteWith(other) {
                this.min = other.min;
                this.max = other.max;
                return this;
            }
            overwriteWithMinAndMax(min, max) {
                this.min = min;
                this.max = max;
                return this;
            }
            random(randomizer) {
                var randomNumber = (randomizer == null ? Math.random() : randomizer.fraction());
                return this.min + (this.max - this.min) * randomNumber;
            }
            size() {
                return this.max - this.min;
            }
            subtract(other) {
                var returnValues = [];
                if (this.overlapsWith(other)) {
                    if (this.min <= other.min) {
                        var segment = new RangeExtent(this.min, other.min);
                        returnValues.push(segment);
                    }
                    if (this.max >= other.max) {
                        var segment = new RangeExtent(other.max, this.max);
                        returnValues.push(segment);
                    }
                }
                else {
                    returnValues.push(this);
                }
                return returnValues;
            }
            trimValue(valueToTrim) {
                if (valueToTrim < this.min) {
                    valueToTrim = this.min;
                }
                else if (valueToTrim > this.max) {
                    valueToTrim = this.max;
                }
                return valueToTrim;
            }
            touches(other) {
                var returnValue = (this.min <= other.max
                    && this.max >= other.min);
                return returnValue;
            }
            wrapValue(valueToWrap) {
                var returnValue = valueToWrap;
                var size = this.size();
                while (returnValue < this.min) {
                    returnValue += size;
                }
                while (returnValue > this.max) {
                    returnValue -= size;
                }
                return returnValue;
            }
        }
        GameFramework.RangeExtent = RangeExtent;
        class RangeExtent_Instances {
            constructor() {
                this.ZeroToOne = new RangeExtent(0, 1);
            }
        }
        GameFramework.RangeExtent_Instances = RangeExtent_Instances;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
