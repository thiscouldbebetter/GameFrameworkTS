"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualMap {
            constructor(map, visualLookup, cameraGet, shouldConvertToImage) {
                this.map = map;
                this.visualLookup = visualLookup;
                this.cameraGet = cameraGet;
                this.shouldConvertToImage =
                    (shouldConvertToImage == null ? true : shouldConvertToImage);
                // Helper variables.
                this._cameraPos = GameFramework.Coords.blank();
                this._cell = this.map.cellPrototype.clone();
                this._cellPosEnd = GameFramework.Coords.blank();
                this._cellPosInCells = GameFramework.Coords.blank();
                this._cellPosStart = GameFramework.Coords.blank();
                this._drawPos = GameFramework.Coords.blank();
                this._posSaved = GameFramework.Coords.blank();
            }
            draw(universe, world, place, entity, display) {
                if (this.shouldConvertToImage) {
                    if (this.visualImage == null) {
                        this.draw_ConvertToImage(universe, world, place, entity, display);
                    }
                    this.visualImage.draw(universe, world, place, entity, display);
                }
                else {
                    var cellPosStart = this._cellPosStart.clear();
                    var cellPosEnd = this._cellPosEnd.overwriteWith(this.map.sizeInCells);
                    this.draw_ConvertToImage_Cells(universe, world, place, entity, display, cellPosStart, cellPosEnd, display);
                }
            }
            draw_ConvertToImage(universe, world, place, entity, display) {
                var mapSizeInCells = this.map.sizeInCells;
                var drawablePos = entity.locatable().loc.pos;
                this._posSaved.overwriteWith(drawablePos);
                var cellPosStart = this._cellPosStart.clear();
                var cellPosEnd = this._cellPosEnd.overwriteWith(mapSizeInCells);
                if (this.cameraGet == null) {
                    cellPosStart.clear();
                    cellPosEnd.overwriteWith(mapSizeInCells);
                }
                else {
                    var camera = this.cameraGet(universe, world, display, entity);
                    this._cameraPos.overwriteWith(camera.loc.pos);
                    var boundsVisible = camera.viewCollider;
                    cellPosStart.overwriteWith(boundsVisible.min()).trimToRangeMax(this.sizeInCells);
                    cellPosEnd.overwriteWith(boundsVisible.max()).trimToRangeMax(this.sizeInCells);
                }
                var displayForImage = new GameFramework.Display2D([this.map.size], null, null, null, null, null);
                displayForImage.toDomElement();
                this.draw_ConvertToImage_Cells(universe, world, place, entity, display, cellPosStart, cellPosEnd, displayForImage);
                var image = GameFramework.Image2.fromSystemImage("Map", displayForImage.canvas);
                this.visualImage = new GameFramework.VisualImageImmediate(image, false); // isScaled
                drawablePos.overwriteWith(this._posSaved);
            }
            draw_ConvertToImage_Cells(universe, world, place, entity, display, cellPosStart, cellPosEnd, displayForImage) {
                var drawPos = this._drawPos;
                var drawablePos = entity.locatable().loc.pos;
                var cellPosInCells = this._cellPosInCells;
                var cellSizeInPixels = this.map.cellSize;
                for (var y = cellPosStart.y; y < cellPosEnd.y; y++) {
                    cellPosInCells.y = y;
                    for (var x = cellPosStart.x; x < cellPosEnd.x; x++) {
                        cellPosInCells.x = x;
                        var cell = this.map.cellAtPosInCells(cellPosInCells);
                        var cellVisualName = cell.visualName;
                        var cellVisual = this.visualLookup.get(cellVisualName);
                        drawPos.overwriteWith(cellPosInCells);
                        if (this.cameraGet == null) {
                            drawPos.multiply(cellSizeInPixels);
                        }
                        else {
                            drawPos.subtract(this._cameraPos).multiply(cellSizeInPixels).add(display.displayToUse().sizeInPixelsHalf);
                        }
                        drawablePos.overwriteWith(drawPos);
                        cellVisual.draw(universe, world, place, entity, displayForImage);
                    }
                }
                return displayForImage;
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
        GameFramework.VisualMap = VisualMap;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
