"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlTimer extends GameFramework.ControlBase {
            constructor(name, secondsToWait, elapsed) {
                super(name, GameFramework.Coords.create(), GameFramework.Coords.create(), null);
                this.name = name;
                this.secondsToWait = secondsToWait;
                this._elapsed = elapsed;
            }
            static fromNameSecondsToWaitAndElapsed(name, secondsToWait, elapsed) {
                return new ControlTimer(name, secondsToWait, elapsed);
            }
            actionHandle(actionName) {
                return false; // wasActionHandled
            }
            elapsed(universe) {
                this._elapsed(universe);
            }
            initialize(universe) {
                this.timeStarted = new Date();
            }
            initializeIsComplete(universe) {
                return true;
            }
            isEnabled() {
                return false;
            }
            mouseClick(pos) {
                return false;
            }
            draw(universe, display, drawLoc, style) {
                // Obviously, this isn't really drawing anything.
                var now = new Date();
                var millisecondsSinceStarted = now.getTime() - this.timeStarted.getTime();
                var secondsSinceStarted = Math.floor(millisecondsSinceStarted / 1000);
                if (secondsSinceStarted >= this.secondsToWait) {
                    this.elapsed(universe);
                }
            }
        }
        GameFramework.ControlTimer = ControlTimer;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
