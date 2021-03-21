"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualAnchor {
            constructor(child, posToAnchorAt, orientationToAnchorAt) {
                this.child = child;
                this.posToAnchorAt = posToAnchorAt;
                this.orientationToAnchorAt = orientationToAnchorAt;
                // Helper variables.
                this._posSaved = GameFramework.Coords.create();
                this._orientationSaved = new GameFramework.Orientation(null, null);
            }
            draw(universe, world, place, entity, display) {
                var drawableLoc = entity.locatable().loc;
                var drawablePos = drawableLoc.pos;
                var drawableOrientation = drawableLoc.orientation;
                this._posSaved.overwriteWith(drawablePos);
                this._orientationSaved.overwriteWith(drawableOrientation);
                if (this.posToAnchorAt != null) {
                    drawablePos.overwriteWith(this.posToAnchorAt);
                }
                if (this.orientationToAnchorAt != null) {
                    drawableOrientation.overwriteWith(this.orientationToAnchorAt);
                }
                this.child.draw(universe, world, place, entity, display);
                drawablePos.overwriteWith(this._posSaved);
                drawableOrientation.overwriteWith(this._orientationSaved);
            }
            ;
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
        GameFramework.VisualAnchor = VisualAnchor;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
