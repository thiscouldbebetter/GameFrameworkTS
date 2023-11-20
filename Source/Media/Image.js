"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Image2 {
            constructor(name, sourcePath) {
                this.name = name;
                this.sourcePath = sourcePath;
                this.isLoaded = false;
                //this.load();
            }
            // static methods
            static create() {
                return new Image2(null, null);
            }
            static fromImageAndBox(imageSource, box) {
                var display = GameFramework.Display2D.fromSizeAndIsInvisible(box.size, true // isInvisible
                ).initialize(null);
                display.drawImagePartial(imageSource, GameFramework.Coords.Instances().Zeroes, box);
                var name = imageSource.name + box.toStringXY();
                var returnImage = display.toImage(name);
                return returnImage;
            }
            static fromSystemImage(name, systemImage) {
                var returnValue = new Image2(name, systemImage.src);
                returnValue.systemImage = systemImage;
                returnValue.sizeInPixels = GameFramework.Coords.fromXY(systemImage.width, systemImage.height);
                returnValue.isLoaded = true;
                return returnValue;
            }
            toTiles(sizeInTiles) {
                var tilePosInTiles = GameFramework.Coords.create();
                var tilePosInPixels = GameFramework.Coords.create();
                var tileSizeInPixels = this.sizeInPixels.clone().divide(sizeInTiles);
                var imageRows = [];
                for (var y = 0; y < sizeInTiles.y; y++) {
                    tilePosInTiles.y = y;
                    var imagesInRow = [];
                    for (var x = 0; x < sizeInTiles.x; x++) {
                        tilePosInTiles.x = x;
                        tilePosInPixels.overwriteWith(tilePosInTiles).multiply(tileSizeInPixels);
                        var box = GameFramework.Box.fromMinAndSize(tilePosInPixels, tileSizeInPixels);
                        var imageForTile = Image2.fromImageAndBox(this, box);
                        imagesInRow.push(imageForTile);
                    }
                    imageRows.push(imagesInRow);
                }
                return imageRows;
            }
            // Clonable.
            clone() {
                var returnValue = Image2.create();
                returnValue.name = this.name;
                returnValue.sourcePath = this.sourcePath;
                returnValue.sizeInPixels = this.sizeInPixels.clone();
                returnValue.systemImage = this.systemImage;
                returnValue.isLoaded = this.isLoaded;
                return returnValue;
            }
            // Loadable.
            load(callback) {
                if (this.sourcePath != null) {
                    var image = this;
                    var imgElement = document.createElement("img");
                    imgElement.onload = (event) => {
                        var imgLoaded = event.target;
                        image.isLoaded = true;
                        image.systemImage = imgLoaded;
                        image.sizeInPixels = new GameFramework.Coords(imgLoaded.width, imgLoaded.height, 0);
                        if (callback != null) {
                            callback(this);
                        }
                    };
                    imgElement.src = this.sourcePath;
                }
                return this;
            }
            unload() {
                this.systemImage = null;
                return this;
            }
        }
        GameFramework.Image2 = Image2;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
