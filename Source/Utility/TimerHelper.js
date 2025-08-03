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
            static default() {
                return TimerHelper.fromTicksPerSecond(25);
            }
            static fromTicksPerSecond(ticksPerSecond) {
                return new TimerHelper(ticksPerSecond);
            }
            initialize(handleEventTimerTick) {
                this.handleEventTimerTick = handleEventTimerTick;
                this.ticksSoFar = 0;
                if (this.ticksPerSecond > 0) {
                    this.systemTimerHandle = setInterval(this.tick.bind(this), this.millisecondsPerTick);
                }
            }
            tick() {
                this.handleEventTimerTick();
                this.ticksSoFar++;
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
            ticksToSeconds(ticksToConvert) {
                var secondsTotal = Math.floor(ticksToConvert / this.ticksPerSecond);
                return secondsTotal;
            }
            ticksToString(ticksToConvert, unitStringHours, unitStringMinutes, unitStringSeconds) {
                var secondsTotal = this.ticksToSeconds(ticksToConvert);
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
