"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class MapOfCells {
            constructor(name, sizeInCells, cellSize, cellPrototype, cellAtPosInCells, cellSource) {
                this.name = name;
                this.sizeInCells = sizeInCells;
                this.cellSize = cellSize;
                this.cellPrototype = cellPrototype;
                this._cellAtPosInCells = cellAtPosInCells;
                this.cellSource = cellSource;
                this.sizeInCellsMinusOnes = this.sizeInCells.clone().subtract(GameFramework.Coords.Instances().Ones);
                this.size = this.sizeInCells.clone().multiply(this.cellSize);
                this.sizeHalf = this.size.clone().half();
                this.cellSizeHalf = this.cellSize.clone().half();
                // Helper variables.
                this._cell = this.cellPrototype.clone();
                this._posInCells = new GameFramework.Coords(0, 0, 0);
            }
            cellAtPos(pos) {
                this._posInCells.overwriteWith(pos).divide(this.cellSize).floor();
                return this.cellAtPosInCells(this._posInCells);
            }
            cellAtPosInCells(cellPosInCells) {
                return this._cellAtPosInCells(this, cellPosInCells, this._cell);
            }
            numberOfCells() {
                return this.sizeInCells.x * this.sizeInCells.y;
            }
            cellsAsEntities(mapAndCellPosToEntity) {
                var returnValues = [];
                var cellPosInCells = new GameFramework.Coords(0, 0, 0);
                var cellPosStart = new GameFramework.Coords(0, 0, 0);
                var cellPosEnd = this.sizeInCells;
                // todo
                // var cellSizeInPixels = this.cellSize;
                // var cellVisual = new VisualRectangle(cellSizeInPixels, Color.byName("Blue"), null, false); // isCentered
                for (var y = cellPosStart.y; y < cellPosEnd.y; y++) {
                    cellPosInCells.y = y;
                    for (var x = cellPosStart.x; x < cellPosEnd.x; x++) {
                        cellPosInCells.x = x;
                        var cellAsEntity = mapAndCellPosToEntity(this, cellPosInCells);
                        returnValues.push(cellAsEntity);
                    }
                }
                return returnValues;
            }
            // cloneable
            clone() {
                return new MapOfCells(this.name, this.sizeInCells, this.cellSize, this.cellPrototype, this.cellAtPosInCells, this.cellSource);
            }
            overwriteWith(other) {
                this.cellSource.overwriteWith(other.cellSource);
            }
        }
        GameFramework.MapOfCells = MapOfCells;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
