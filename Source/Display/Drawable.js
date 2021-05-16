"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Drawable {
            constructor(visual, isVisible) {
                this.visual = visual;
                this.isVisible = isVisible || true;
            }
            static fromVisual(visual) {
                return new Drawable(visual, null);
            }
            updateForTimerTick(universe, world, place, entity) {
                if (this.isVisible) {
                    this.visual.draw(universe, world, place, entity, universe.display);
                }
            }
            // cloneable
            clone() {
                return new Drawable(this.visual, this.isVisible);
            }
            // EntityProperty.
            finalize(u, w, p, e) { }
            initialize(u, w, p, e) { }
        }
        GameFramework.Drawable = Drawable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
