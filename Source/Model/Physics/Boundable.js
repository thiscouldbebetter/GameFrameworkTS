"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Boundable extends GameFramework.EntityProperty {
            constructor(bounds) {
                super();
                this.bounds = bounds;
            }
            updateForTimerTick(u, w, p, e) {
                this.bounds.locate(e.locatable().loc);
            }
            clone() {
                return new Boundable(this.bounds.clone());
            }
            overwriteWith(other) {
                this.bounds.overwriteWith(other.bounds);
                return this;
            }
        }
        GameFramework.Boundable = Boundable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
