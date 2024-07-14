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
            static default() {
                var cells = new Array();
                var cellCreate = () => new MapCellGeneric("todo");
                var cellSource = new MapOfCellsCellSourceArray(cells, cellCreate);
                return new MapOfCells(MapOfCells.name, GameFramework.Coords.fromXY(3, 3), // sizeInCells
                GameFramework.Coords.fromXY(10, 10), // cellSize
                cellSource);
            }
            static fromNameSizeInCellsAndCellSize(name, sizeInCells, cellSize) {
                var cells = new Array();
                var cellSource = new MapOfCellsCellSourceArray(cells, () => null);
                return new MapOfCells(name, sizeInCells, cellSize, cellSource);
            }
            cellAtPos(pos) {
                this._posInCells.overwriteWith(pos).divide(this.cellSize).floor();
                var returnCell = this.cellAtPosInCells(this._posInCells);
                if (returnCell == null) {
                    throw new Error("Cell at logical pos " + pos.toString() + " could not be retrieved.");
                }
                return returnCell;
            }
            cellAtPosInCells(cellPosInCells) {
                var returnCell = this.cellSource.cellAtPosInCells(this, cellPosInCells, this._cell);
                if (returnCell == null) {
                    throw new Error("Cell at cell pos " + cellPosInCells.toString() + " could not be retrieved.");
                }
                return returnCell;
            }
            cellAtPosInCellsExists(cellPosInCells) {
                var cellFound = this.cellSource.cellAtPosInCells(this, cellPosInCells, this._cell);
                return (cellFound != null);
            }
            cellAtPosInCellsNoOverwrite(cellPosInCells) {
                var returnCell = this.cellSource.cellAtPosInCellsNoOverwrite(this, cellPosInCells);
                if (returnCell == null) {
                    throw new Error("Cell at cell pos " + cellPosInCells.toString() + " could not be retrieved.");
                }
                return returnCell;
            }
            cellCreate() {
                return this.cellSource.cellCreate();
            }
            cellsCount() {
                return this.sizeInCells.x * this.sizeInCells.y;
            }
            cellsInBox(box, cellsInBox) {
                GameFramework.ArrayHelper.clear(cellsInBox);
                var minPosInCells = this._posInCellsMin.overwriteWith(box.min()).divide(this.cellSize).floor().trimToRangeMax(this.sizeInCellsMinusOnes);
                var maxPosInCells = this._posInCellsMax.overwriteWith(box.max()).divide(this.cellSize).floor().trimToRangeMax(this.sizeInCellsMinusOnes);
                var cellPosInCells = this._posInCells;
                for (var y = minPosInCells.y; y <= maxPosInCells.y; y++) {
                    cellPosInCells.y = y;
                    for (var x = minPosInCells.x; x <= maxPosInCells.x; x++) {
                        cellPosInCells.x = x;
                        var cellAtPos = this.cellAtPosInCellsNoOverwrite(cellPosInCells);
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
        class MapCellGeneric {
            constructor(value) {
                this.value = value;
            }
            clone() {
                return this;
            }
            overwriteWith(other) {
                return this;
            }
        }
        GameFramework.MapCellGeneric = MapCellGeneric;
        class MapOfCellsCellSourceArray {
            constructor(cells, cellCreate) {
                this.cells = cells;
                this._cellCreate = cellCreate;
            }
            cellAtPosInCells(map, posInCells, cellToOverwrite) {
                var cellFound = this.cellAtPosInCellsNoOverwrite(map, posInCells);
                cellToOverwrite.overwriteWith(cellFound);
                return cellToOverwrite;
            }
            cellAtPosInCellsNoOverwrite(map, posInCells) {
                var cellIndex = posInCells.y * map.sizeInCells.x + posInCells.x;
                var cellFound = this.cells[cellIndex];
                if (cellFound == null) {
                    cellFound = this.cellCreate();
                    this.cells[cellIndex] = cellFound;
                }
                return cellFound;
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
        class MapOfCellsCellSourceDisplay {
            constructor(display, cellCreate, cellOverwriteFromColor) {
                this.displaySizeInPixels = display.sizeInPixels;
                this.displayPixelsAsComponentArrayRGBA =
                    display.toComponentArrayRGBA();
                this._cellCreate = cellCreate;
                this._cellOverwriteFromColor = cellOverwriteFromColor;
                this._color = GameFramework.Color.default();
                this._componentsPerPixel = 4;
            }
            cellAtPosInCells(map, posInCells, cellToOverwrite) {
                var color = this.colorAtPos(posInCells, this._color);
                this._cellOverwriteFromColor(cellToOverwrite, color);
                return cellToOverwrite;
            }
            cellAtPosInCellsNoOverwrite(map, posInCells) {
                return this.cellAtPosInCells(map, posInCells, this.cellCreate());
            }
            cellCreate() {
                return this._cellCreate();
            }
            clone() {
                return this; // todo
            }
            colorAtPos(pos, colorOut) {
                var pixelIndexStart = (pos.y * this.displaySizeInPixels.x + pos.x)
                    * this._componentsPerPixel;
                var pixelAsComponents = this.displayPixelsAsComponentArrayRGBA.slice(pixelIndexStart, pixelIndexStart + this._componentsPerPixel);
                colorOut.overwriteWithComponentsRGBA255(pixelAsComponents);
                return colorOut;
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.MapOfCellsCellSourceDisplay = MapOfCellsCellSourceDisplay;
        class MapOfCellsCellSourceImage {
            constructor(cellsAsImage, cellCreate, cellSetFromColor) {
                this.cellsAsDisplay = GameFramework.Display2D.fromImage(cellsAsImage);
                this._cellCreate = cellCreate;
                this._cellSetFromColor = cellSetFromColor;
                this._pixelColor = GameFramework.Color.create();
            }
            cellAtPosInCells(map, posInCells, cellToOverwrite) {
                var pixelColor = this.cellsAsDisplay.colorAtPos(posInCells, this._pixelColor);
                this.cellSetFromColor(cellToOverwrite, pixelColor);
                return cellToOverwrite;
            }
            cellAtPosInCellsNoOverwrite(map, posInCells) {
                return this.cellAtPosInCells(map, posInCells, this.cellCreate());
            }
            cellCreate() {
                return this._cellCreate();
            }
            cellSetFromColor(cell, color) {
                return this._cellSetFromColor(cell, color);
            }
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.MapOfCellsCellSourceImage = MapOfCellsCellSourceImage;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
