"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class MapOfCells {
            constructor(name, sizeInCells, cellSize, cellSource) {
                this.name = name;
                this.sizeInCells = sizeInCells;
                this.cellSize = cellSize;
                this.cellSource = cellSource;
                this.sizeInCellsMinusOnes = this.sizeInCells.clone().subtract(GameFramework.Coords.Instances().Ones);
                this.size = this.sizeInCells.clone().multiply(this.cellSize);
                this.sizeHalf = this.size.clone().half();
                this.cellSizeHalf = this.cellSize.clone().half();
                // Helper variables.
                this._cell = this.cellCreate();
                this._posInCells = GameFramework.Coords.create();
                this._posInCellsMax = GameFramework.Coords.create();
                this._posInCellsMin = GameFramework.Coords.create();
            }
            static fromNameSizeInCellsAndCellSize(name, sizeInCells, cellSize) {
                return new MapOfCells(name, sizeInCells, cellSize, null);
            }
            cellAtPos(pos) {
                this._posInCells.overwriteWith(pos).divide(this.cellSize).floor();
                return this.cellAtPosInCells(this._posInCells);
            }
            cellAtPosInCells(cellPosInCells) {
                return this.cellSource.cellAtPosInCells(this, cellPosInCells, this._cell);
            }
            cellCreate() {
                return this.cellSource.cellCreate();
            }
            cellsCount() {
                return this.sizeInCells.x * this.sizeInCells.y;
            }
            cellsInBoxAddToList(box, cellsInBox) {
                GameFramework.ArrayHelper.clear(cellsInBox);
                var minPosInCells = this._posInCellsMin.overwriteWith(box.min()).divide(this.cellSize).floor().trimToRangeMax(this.sizeInCellsMinusOnes);
                var maxPosInCells = this._posInCellsMax.overwriteWith(box.max()).divide(this.cellSize).floor().trimToRangeMax(this.sizeInCellsMinusOnes);
                var cellPosInCells = this._posInCells;
                for (var y = minPosInCells.y; y <= maxPosInCells.y; y++) {
                    cellPosInCells.y = y;
                    for (var x = minPosInCells.x; x <= maxPosInCells.x; x++) {
                        cellPosInCells.x = x;
                        var cellAtPos = this.cellAtPosInCells(cellPosInCells);
                        cellsInBox.push(cellAtPos);
                    }
                }
                return cellsInBox;
            }
            cellsAsEntities(mapAndCellPosToEntity) {
                var returnValues = new Array();
                var cellPosInCells = GameFramework.Coords.create();
                var cellPosStart = GameFramework.Coords.create();
                var cellPosEnd = this.sizeInCells;
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
                return new MapOfCells(this.name, this.sizeInCells, this.cellSize, this.cellSource);
            }
            overwriteWith(other) {
                this.cellSource.overwriteWith(other.cellSource);
                return this;
            }
        }
        GameFramework.MapOfCells = MapOfCells;
        class MapOfCellsCellSourceArray {
            constructor(cells, cellCreate) {
                this.cells = cells;
                this._cellCreate = cellCreate;
            }
            cellAtPosInCells(map, posInCells, cellToOverwrite) {
                var cellIndex = posInCells.y * map.sizeInCells.x + posInCells.x;
                var cellFound = this.cells[cellIndex];
                cellToOverwrite.overwriteWith(cellFound);
                return cellToOverwrite;
            }
            cellCreate() {
                return this._cellCreate();
            }
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.MapOfCellsCellSourceArray = MapOfCellsCellSourceArray;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
