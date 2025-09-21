"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualAnchorOrientation extends GameFramework.VisualBase {
            constructor(orientationToAnchorAt, child) {
                super();
                this.child = child;
                this.orientationToAnchorAt = orientationToAnchorAt;
                // Helper variables.
                this._orientationSaved = new GameFramework.Orientation(null, null);
            }
            static fromOrientationAndChild(orientationToAnchorAt, child) {
                return new VisualAnchorOrientation(orientationToAnchorAt, child);
            }
            static fromChild(child) {
                return new VisualAnchorOrientation(GameFramework.Orientation.default(), child);
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
                var drawableOrientation = drawableLoc.orientation;
                this._orientationSaved.overwriteWith(drawableOrientation);
                drawableOrientation.overwriteWith(this.orientationToAnchorAt);
                this.child.draw(uwpe, display);
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
        GameFramework.VisualAnchorOrientation = VisualAnchorOrientation;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
