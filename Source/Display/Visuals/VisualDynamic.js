"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualDynamic extends GameFramework.VisualBase {
            constructor(visualGet) {
                super();
                this._visualGet = visualGet;
            }
            static fromVisualGet(visualGet) {
                return new VisualDynamic(visualGet);
            }
            visualGet(uwpe) {
                return this._visualGet(uwpe);
            }
            // Visual.
            initialize(uwpe) {
                // Do nothing.
            }
            initializeIsComplete(uwpe) {
                var visual = this.visualGet(uwpe);
                var visualIsInitialized = visual.initializeIsComplete(uwpe);
                return visualIsInitialized;
            }
            draw(uwpe, display) {
                var visual = this.visualGet(uwpe);
                visual.draw(uwpe, display);
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
        GameFramework.VisualDynamic = VisualDynamic;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
