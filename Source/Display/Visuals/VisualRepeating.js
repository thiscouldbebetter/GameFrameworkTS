"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualRepeating {
            constructor(cellSize, viewSize, child, expandViewStartAndEndByCell) {
                this.cellSize = cellSize;
                this.viewSize = viewSize;
                this.child = child;
                if (this.cellSize.z == 0) {
                    throw ("Invalid argument: cellSize.z must not be 0.");
                }
                this.viewSizeInCells = this.viewSize.clone().divide(this.cellSize);
                this._cellPos = GameFramework.Coords.create();
                this._drawOffset = GameFramework.Coords.create();
                this._drawPosWrapped = GameFramework.Coords.create();
                this._drawablePosToRestore = GameFramework.Coords.create();
                this._endPosInCells = this.viewSizeInCells.clone();
                this._startPosInCells = GameFramework.Coords.create();
                if (expandViewStartAndEndByCell) {
                    this._startPosInCells.addDimensions(-1, -1, 0);
                    this._endPosInCells.addDimensions(1, 1, 0);
                }
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
                this._drawablePosToRestore.overwriteWith(drawPos);
                var drawPosWrapped = this._drawPosWrapped.overwriteWith(drawPos).wrapToRangeMax(this.cellSize);
                var cellPos = this._cellPos;
                for (var y = this._startPosInCells.y; y < this._endPosInCells.y; y++) {
                    cellPos.y = y;
                    for (var x = this._startPosInCells.x; x < this._endPosInCells.x; x++) {
                        cellPos.x = x;
                        drawPos.overwriteWith(this._drawOffset.overwriteWith(cellPos).multiply(this.cellSize)).add(drawPosWrapped);
                        this.child.draw(uwpe, display);
                    }
                }
                drawPos.overwriteWith(this._drawablePosToRestore);
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
        GameFramework.VisualRepeating = VisualRepeating;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
