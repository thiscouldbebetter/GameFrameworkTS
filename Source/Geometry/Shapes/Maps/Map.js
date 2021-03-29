"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class MapOfCells {
            constructor(name, sizeInCells, cellSize, cellCreate, cellAtPosInCells, cellSource) {
                this.name = name;
                this.sizeInCells = sizeInCells;
                this.cellSize = cellSize;
                this.cellCreate = cellCreate || this.cellCreateDefault;
                this._cellAtPosInCells = cellAtPosInCells || this.cellAtPosInCellsDefault;
                this.cellSource = cellSource || new Array();
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
            cellAtPos(pos) {
                this._posInCells.overwriteWith(pos).divide(this.cellSize).floor();
                return this.cellAtPosInCells(this._posInCells);
            }
            cellAtPosInCells(cellPosInCells) {
                return this._cellAtPosInCells(this, cellPosInCells, this._cell);
            }
            cellAtPosInCellsDefault(map, cellPosInCells, cell) {
                var cellIndex = cellPosInCells.y * this.sizeInCells.x + cellPosInCells.x;
                var cell = this.cellSource[cellIndex];
                if (cell == null) {
                    cell = this.cellCreate();
                    this.cellSource[cellIndex] = cell;
                }
                return cell;
            }
            cellCreateDefault() {
                return {};
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
                return new MapOfCells(this.name, this.sizeInCells, this.cellSize, this.cellCreate, this._cellAtPosInCells, this.cellSource);
            }
            overwriteWith(other) {
                this.cellSource.overwriteWith(other.cellSource);
                return this;
            }
        }
        GameFramework.MapOfCells = MapOfCells;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
