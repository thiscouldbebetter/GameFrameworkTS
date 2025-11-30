"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualMap extends GameFramework.VisualBase {
            constructor(map, visualsByName, cameraGet, shouldConvertToImage) {
                super();
                this.map = map;
                this.visualsByName = visualsByName;
                this.cameraGet = cameraGet;
                this.shouldConvertToImage =
                    (shouldConvertToImage == null ? true : shouldConvertToImage);
                // Helper variables.
                this._cameraPos = Coords.create();
                //this._cell = this.map.cellCreate();
                this._cellPosEnd = Coords.create();
                this._cellPosInCells = Coords.create();
                this._cellPosStart = Coords.create();
                this._drawPos = Coords.create();
                this._posSaved = Coords.create();
            }
            // Visual.
            initialize(uwpe) {
                // Do nothing.
            }
            initializeIsComplete(uwpe) {
                return true; // todo
            }
            draw(uwpe, display) {
                if (this.shouldConvertToImage) {
                    if (this.visualImage == null) {
                        this.draw_ConvertToImage(uwpe, display);
                    }
                    this.visualImage.draw(uwpe, display);
                }
                else {
                    var cellPosStart = this._cellPosStart.clear();
                    var cellPosEnd = this._cellPosEnd.overwriteWith(this.map.sizeInCells);
                    this.draw_ConvertToImage_Cells(uwpe, display, cellPosStart, cellPosEnd, display);
                }
            }
            draw_ConvertToImage(uwpe, display) {
                var entity = uwpe.entity;
                var mapSizeInCells = this.map.sizeInCells;
                var drawablePos = GameFramework.Locatable.of(entity).loc.pos;
                this._posSaved.overwriteWith(drawablePos);
                var cellPosStart = this._cellPosStart.clear();
                var cellPosEnd = this._cellPosEnd.overwriteWith(mapSizeInCells);
                if (this.cameraGet == null) {
                    cellPosStart.clear();
                    cellPosEnd.overwriteWith(mapSizeInCells);
                }
                else {
                    var camera = this.cameraGet(uwpe);
                    this._cameraPos.overwriteWith(camera.loc.pos);
                    var boundsVisible = camera.viewCollider;
                    cellPosStart.overwriteWith(boundsVisible.min()).trimToRangeMax(this.sizeInCells);
                    cellPosEnd.overwriteWith(boundsVisible.max()).trimToRangeMax(this.sizeInCells);
                }
                var displayForImage = GameFramework.Display2D.fromSize(this.map.size);
                displayForImage.toDomElement();
                this.draw_ConvertToImage_Cells(uwpe, display, cellPosStart, cellPosEnd, displayForImage);
                var image = GameFramework.Image2.fromSystemImage("Map", displayForImage.canvas);
                this.visualImage = new GameFramework.VisualImageImmediate(image, false); // isScaled
                drawablePos.overwriteWith(this._posSaved);
            }
            draw_ConvertToImage_Cells(uwpe, display, cellPosStart, cellPosEnd, displayForImage) {
                var entity = uwpe.entity;
                var drawPos = this._drawPos;
                var drawablePos = GameFramework.Locatable.of(entity).loc.pos;
                var cellPosInCells = this._cellPosInCells;
                var cellSizeInPixels = this.map.cellSize;
                for (var y = cellPosStart.y; y < cellPosEnd.y; y++) {
                    cellPosInCells.y = y;
                    for (var x = cellPosStart.x; x < cellPosEnd.x; x++) {
                        cellPosInCells.x = x;
                        var cell = this.map.cellAtPosInCells(cellPosInCells);
                        var cellVisualName = cell.visualName;
                        var cellVisual = this.visualsByName.get(cellVisualName);
                        drawPos.overwriteWith(cellPosInCells);
                        if (this.cameraGet == null) {
                            drawPos.multiply(cellSizeInPixels);
                        }
                        else {
                            drawPos.subtract(this._cameraPos).multiply(cellSizeInPixels).add(display.displayToUse().sizeInPixelsHalf);
                        }
                        drawablePos.overwriteWith(drawPos);
                        cellVisual.draw(uwpe, displayForImage);
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
