"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualBuffered extends GameFramework.VisualBase {
            constructor(size, child) {
                super();
                this.size = size;
                this.child = child;
                this.displayForBuffer = GameFramework.Display2D.fromSizeAndIsInvisible(this.size, true);
                this.sizeHalf = this.size.clone().half();
                this._posSaved = Coords.create();
                this.displayForBuffer.initialize(null);
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
                var drawPos = GameFramework.Locatable.of(entity).loc.pos;
                this._posSaved.overwriteWith(drawPos);
                drawPos.overwriteWith(this.sizeHalf);
                this.child.draw(uwpe, this.displayForBuffer);
                drawPos.overwriteWith(this._posSaved);
                drawPos.subtract(this.sizeHalf);
                display.drawImage(this.displayForBuffer.toImage(VisualBuffered.name), drawPos);
                drawPos.overwriteWith(this._posSaved);
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
        GameFramework.VisualBuffered = VisualBuffered;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
