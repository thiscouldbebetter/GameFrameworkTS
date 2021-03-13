"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ValueBreakGroup {
            constructor(stops, interpolationMode) {
                this.stops = stops;
                this.interpolationMode = interpolationMode;
            }
            valueAtPosition(positionToCheck) {
                var returnValue = null;
                var stopPrev = this.stops[0];
                var stop;
                for (var i = 1; i < this.stops.length; i++) {
                    stop = this.stops[i];
                    if (positionToCheck >= stopPrev.position
                        && positionToCheck <= stop.position) {
                        break;
                    }
                    stopPrev = stop;
                }
                if (this.interpolationMode != null) {
                    var stopPrevValue = stopPrev.value;
                    var stopValue = stop.value;
                    var positionOfStopThisMinusPrev = stop.position - stopPrev.position;
                    var positionToCheckMinusStopPrev = positionToCheck - stopPrev.position;
                    var fraction = positionToCheckMinusStopPrev / positionOfStopThisMinusPrev;
                    fraction = this.interpolationMode.fractionAdjust(fraction);
                    var valueInterpolated = stopPrevValue.interpolateWith(stopValue, fraction);
                    returnValue = valueInterpolated;
                }
                else {
                    returnValue = stopPrev.value;
                }
                return returnValue;
            }
        }
        GameFramework.ValueBreakGroup = ValueBreakGroup;
        class ValueBreak {
            constructor(position, value) {
                this.position = position;
                this.value = value;
            }
        }
        GameFramework.ValueBreak = ValueBreak;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
