"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TimerHelper {
            constructor(ticksPerSecond) {
                this.ticksPerSecond = ticksPerSecond;
                var millisecondsPerSecond = 1000;
                this.millisecondsPerTick = Math.floor(millisecondsPerSecond / this.ticksPerSecond);
            }
            initialize(handleEventTimerTick) {
                this.timer = setInterval(handleEventTimerTick, this.millisecondsPerTick);
            }
            ticksToStringH_M_S(ticksToConvert) {
                return this.ticksToString(ticksToConvert, " h ", " m ", " s");
            }
            ticksToStringHColonMColonS(ticksToConvert) {
                return this.ticksToString(ticksToConvert, ":", ":", "");
            }
            ticksToStringHours_Minutes_Seconds(ticksToConvert) {
                return this.ticksToString(ticksToConvert, " hours ", " minutes ", " seconds");
            }
            ticksToString(ticksToConvert, unitStringHours, unitStringMinutes, unitStringSeconds) {
                var secondsTotal = Math.floor(ticksToConvert / this.ticksPerSecond);
                var minutesTotal = Math.floor(secondsTotal / 60);
                var hoursTotal = Math.floor(minutesTotal / 60);
                var timeAsString = hoursTotal + unitStringHours
                    + (minutesTotal % 60) + unitStringMinutes
                    + (secondsTotal % 60) + unitStringSeconds;
                return timeAsString;
            }
        }
        GameFramework.TimerHelper = TimerHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
