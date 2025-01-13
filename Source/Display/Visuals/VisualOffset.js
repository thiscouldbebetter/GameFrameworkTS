"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualOffset {
            constructor(offset, child) {
                this.offset = offset;
                this.child = child;
                // Helper variables.
                this._posSaved = GameFramework.Coords.create();
            }
            static fromChildAndOffset(child, offset) {
                return new VisualOffset(offset, child);
            }
            static fromOffsetAndChild(offset, child) {
                return new VisualOffset(offset, child);
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
                var drawablePos = GameFramework.Locatable.of(entity).loc.pos;
                this._posSaved.overwriteWith(drawablePos);
                drawablePos.add(this.offset);
                this.child.draw(uwpe, display);
                drawablePos.overwriteWith(this._posSaved);
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
        GameFramework.VisualOffset = VisualOffset;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
