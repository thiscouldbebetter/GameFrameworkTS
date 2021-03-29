"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Drawable extends GameFramework.EntityProperty {
            constructor(visual, isVisible) {
                super();
                this.visual = visual;
                this.isVisible = (isVisible == null ? true : isVisible);
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
        }
        GameFramework.Drawable = Drawable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
