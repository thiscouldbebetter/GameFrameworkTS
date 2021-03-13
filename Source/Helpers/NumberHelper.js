"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class NumberHelper {
            // static class
            static isInRangeMinMax(n, min, max) {
                return (n >= min && n <= max);
            }
            static reflectNumberOffRange(numberToReflect, rangeMin, rangeMax) {
                while (numberToReflect < rangeMin) {
                    numberToReflect = rangeMin + rangeMin - numberToReflect;
                }
                while (numberToReflect > rangeMax) {
                    numberToReflect = rangeMax - (numberToReflect - rangeMax);
                }
                return NumberHelper.trimToRangeMinMax(numberToReflect, rangeMin, rangeMax);
            }
            static roundToDecimalPlaces(n, numberOfPlaces) {
                var multiplier = Math.pow(10, numberOfPlaces);
                return Math.round(n * multiplier) / multiplier;
            }
            static subtractWrappedToRangeMax(n, subtrahend, max) {
                var differenceUnwrapped = n - subtrahend;
                var differenceAbsolute = Math.abs(differenceUnwrapped);
                var differenceAbsoluteLeastSoFar = differenceAbsolute;
                var returnValue = differenceUnwrapped;
                for (var i = -1; i <= 1; i += 2) {
                    var differenceWrapped = differenceUnwrapped + max * i;
                    differenceAbsolute = Math.abs(differenceWrapped);
                    if (differenceAbsolute < differenceAbsoluteLeastSoFar) {
                        differenceAbsoluteLeastSoFar = differenceAbsolute;
                        returnValue = differenceWrapped;
                    }
                }
                return returnValue;
            }
            static trimToRangeMax(n, max) {
                return NumberHelper.trimToRangeMinMax(n, 0, max);
            }
            ;
            static trimToRangeMinMax(n, min, max) {
                var value = n;
                if (value < min) {
                    value = min;
                }
                else if (value > max) {
                    value = max;
                }
                return value;
            }
            static wrapToRangeMax(n, max) {
                return NumberHelper.wrapToRangeMinMax(n, 0, max);
            }
            static wrapToRangeMinMax(n, min, max) {
                var value = n;
                var rangeSize = max - min;
                if (rangeSize == 0) {
                    value = min;
                }
                else {
                    while (value < min) {
                        value += rangeSize;
                    }
                    while (value >= max) {
                        value -= rangeSize;
                    }
                }
                return value;
            }
            static wrapToRangeZeroOne(n) {
                return NumberHelper.wrapToRangeMinMax(n, 0, 1);
            }
        }
        GameFramework.NumberHelper = NumberHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
