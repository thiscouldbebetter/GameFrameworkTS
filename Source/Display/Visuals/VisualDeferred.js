"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualDeferred {
            constructor(visualGet) {
                this._visualGet = visualGet;
            }
            visualGet(uwpe) {
                if (this._visualCached == null) {
                    this._visualCached = this._visualGet(uwpe);
                }
                return this._visualCached;
            }
            // Visual.
            draw(uwpe, display) {
                var visual = this.visualGet(uwpe);
                visual.draw(uwpe, display);
            }
            // Clonable.
            clone() {
                return new VisualDeferred(this._visualGet);
            }
            overwriteWith(other) {
                this._visualGet = other._visualGet;
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
        }
        GameFramework.VisualDeferred = VisualDeferred;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
