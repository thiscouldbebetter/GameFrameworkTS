"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualControl extends GameFramework.VisualBase {
            constructor(controlRoot) {
                super();
                this.controlRoot = controlRoot;
                // Helper variables.
                this._drawLoc = new GameFramework.Disposition(GameFramework.Coords.create(), null, null);
            }
            // Visual.
            initialize(uwpe) {
                // Do nothing.
            }
            initializeIsComplete(uwpe) {
                return true;
            }
            draw(uwpe, display) {
                var universe = uwpe.universe;
                var display = universe.display;
                var drawLoc = this._drawLoc;
                drawLoc.pos.clear();
                this.controlRoot.draw(universe, display, drawLoc, null);
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
        }
        GameFramework.VisualControl = VisualControl;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
