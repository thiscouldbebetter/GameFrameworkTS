"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ControlTimer extends GameFramework.ControlBase {
            constructor(name, secondsToWait, elapsed) {
                super(name, Coords.create(), Coords.create(), null);
                this.name = name;
                this.secondsToWait = secondsToWait;
                this._elapsed = elapsed;
                this.hasElapsed = false;
                this.timeStarted = null;
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
                this.timerStartOrRestart();
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
            timerStartOrRestart() {
                this.timeStarted = new Date();
            }
            // Drawing.
            draw(universe, display, drawLoc, style) {
                // Obviously, this isn't really drawing anything.
                if (this.hasElapsed == false) {
                    if (this.timeStarted != null) {
                        var now = new Date();
                        var millisecondsSinceStarted = now.getTime() - this.timeStarted.getTime();
                        var secondsSinceStarted = Math.floor(millisecondsSinceStarted / 1000);
                        if (secondsSinceStarted >= this.secondsToWait) {
                            this.hasElapsed = true;
                            this.elapsed(universe);
                        }
                    }
                }
            }
        }
        GameFramework.ControlTimer = ControlTimer;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
