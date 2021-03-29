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
            // EntityProperty.
            initialize(u, w, p, e) {
                this.updateForTimerTick(u, w, p, e);
            }
            updateForTimerTick(u, w, p, e) {
                this.bounds.locate(e.locatable().loc);
            }
            // Clonable.
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
