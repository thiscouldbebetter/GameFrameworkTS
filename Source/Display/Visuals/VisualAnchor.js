"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualAnchor extends GameFramework.VisualBase {
            constructor(child, posToAnchorAt, orientationToAnchorAt) {
                super();
                this.child = child;
                this.posToAnchorAt = posToAnchorAt;
                this.orientationToAnchorAt = orientationToAnchorAt;
                // Helper variables.
                this._posSaved = GameFramework.Coords.create();
                this._orientationSaved = new GameFramework.Orientation(null, null);
            }
            static fromChildAndOrientationToAnchorAt(child, orientationToAnchorAt) {
                return new VisualAnchor(child, null, orientationToAnchorAt);
            }
            static fromChildAndPosToAnchorAt(child, posToAnchorAt) {
                return new VisualAnchor(child, posToAnchorAt, null);
            }
            // Visual.
            initialize(uwpe) {
                this.child.initialize(uwpe);
            }
            initializeIsComplete(uwpe) {
                return this.child.initializeIsComplete(uwpe);
            }
            draw(uwpe, display) {
                var entity = uwpe.entity;
                var drawableLoc = GameFramework.Locatable.of(entity).loc;
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
                this.child.draw(uwpe, display);
                drawablePos.overwriteWith(this._posSaved);
                drawableOrientation.overwriteWith(this._orientationSaved);
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
        GameFramework.VisualAnchor = VisualAnchor;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
