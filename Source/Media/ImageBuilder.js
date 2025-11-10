"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ImageBuilder {
            constructor(colors) {
                this.colors = colors;
                this.colorsByCode =
                    GameFramework.ArrayHelper.addLookups(this.colors, x => x.code);
            }
            static default() {
                return new ImageBuilder(GameFramework.Color.Instances()._All);
            }
            // Utility methods.
            copyRegionFromImage(imageToCopyFrom, regionPos, regionSize) {
                var canvas = document.createElement("canvas");
                canvas.id = "region_" + regionPos.x + "_" + regionPos.y;
                canvas.width = regionSize.x;
                canvas.height = regionSize.y;
                canvas.style.position = "absolute";
                var graphics = canvas.getContext("2d");
                graphics.drawImage(imageToCopyFrom.systemImage, regionPos.x, regionPos.y, // source pos
                regionSize.x, regionSize.y, // source size
                0, 0, // destination pos
                regionSize.x, regionSize.y // destination size
                );
                var imageFromCanvasURL = canvas.toDataURL("image/png");
                var htmlImageFromCanvas = document.createElement("img");
                htmlImageFromCanvas.width = canvas.width;
                htmlImageFromCanvas.height = canvas.height;
                htmlImageFromCanvas.style.position = "absolute";
                htmlImageFromCanvas.src = imageFromCanvasURL;
                var returnValue = GameFramework.Image2.fromSystemImage(imageToCopyFrom.name, htmlImageFromCanvas);
                return returnValue;
            }
            imageBuildFromNameColorsAndPixelsAsStrings(name, colors, pixelsForStrings) {
                return this.imageBuildFromStrings(name, colors, pixelsForStrings);
            }
            imagesBuildFromStringArrays(name, colors, stringArraysForImagePixels) {
                var returnValue = new Array();
                for (var i = 0; i < stringArraysForImagePixels.length; i++) {
                    var stringsForImagePixels = stringArraysForImagePixels[i];
                    var image = this.imageBuildFromStrings(name + i, colors, stringsForImagePixels);
                    returnValue.push(image);
                }
                return returnValue;
            }
            imageBuildFromStrings(name, colors, stringsForPixels) {
                return this.imageBuildFromStringsScaled(name, colors, stringsForPixels, GameFramework.Coords.Instances().Ones);
            }
            imageBuildFromStringsScaled(name, colors, stringsForPixels, scaleFactor) {
                var colorsByCode = new Map(colors.map(x => [x.code, x]));
                var sizeInPixels = GameFramework.Coords.fromXY(stringsForPixels[0].length, stringsForPixels.length);
                var canvas = document.createElement("canvas");
                canvas.width = sizeInPixels.x * scaleFactor.x;
                canvas.height = sizeInPixels.y * scaleFactor.y;
                var graphics = canvas.getContext("2d");
                var pixelPos = GameFramework.Coords.create();
                var colorForPixel;
                for (var y = 0; y < sizeInPixels.y; y++) {
                    var stringForPixelRow = stringsForPixels[y];
                    pixelPos.y = y * scaleFactor.y;
                    for (var x = 0; x < sizeInPixels.x; x++) {
                        var codeForPixel = stringForPixelRow[x];
                        pixelPos.x = x * scaleFactor.x;
                        colorForPixel = colorsByCode.get(codeForPixel);
                        graphics.fillStyle = colorForPixel.systemColor();
                        graphics.fillRect(pixelPos.x, pixelPos.y, scaleFactor.x, scaleFactor.y);
                    }
                }
                var imageFromCanvasURL = canvas.toDataURL("image/png");
                var htmlImageFromCanvas = document.createElement("img");
                htmlImageFromCanvas.width = canvas.width;
                htmlImageFromCanvas.height = canvas.height;
                htmlImageFromCanvas.src = imageFromCanvasURL;
                var returnValue = GameFramework.Image2.fromSystemImage(name, htmlImageFromCanvas);
                return returnValue;
            }
            imageSliceIntoTiles(imageToSlice, sizeInTiles) {
                var returnImages = new Array();
                var systemImageToSlice = imageToSlice.systemImage;
                var imageToSliceSize = imageToSlice.sizeInPixels;
                var tileSize = imageToSliceSize.clone().divide(sizeInTiles);
                var tilePos = GameFramework.Coords.create();
                var sourcePos = GameFramework.Coords.create();
                for (var y = 0; y < sizeInTiles.y; y++) {
                    tilePos.y = y;
                    var returnImageRow = new Array();
                    for (var x = 0; x < sizeInTiles.x; x++) {
                        tilePos.x = x;
                        var canvas = document.createElement("canvas");
                        canvas.id = "tile_" + x + "_" + y;
                        canvas.width = tileSize.x;
                        canvas.height = tileSize.y;
                        canvas.style.position = "absolute";
                        var graphics = canvas.getContext("2d");
                        sourcePos.overwriteWith(tilePos).multiply(tileSize);
                        graphics.drawImage(systemImageToSlice, sourcePos.x, sourcePos.y, // source pos
                        tileSize.x, tileSize.y, // source size
                        0, 0, // destination pos
                        tileSize.x, tileSize.y // destination size
                        );
                        // browser dependent?
                        var imageFromCanvasURL = canvas.toDataURL("image/png");
                        var htmlImageFromCanvas = document.createElement("img");
                        htmlImageFromCanvas.width = canvas.width;
                        htmlImageFromCanvas.height = canvas.height;
                        htmlImageFromCanvas.style.position = "absolute";
                        htmlImageFromCanvas.src = imageFromCanvasURL;
                        var imageFromCanvas = GameFramework.Image2.fromSystemImage(imageToSlice.name + tilePos.toString(), htmlImageFromCanvas);
                        returnImageRow.push(imageFromCanvas);
                    }
                    returnImages.push(returnImageRow);
                }
                return returnImages;
            }
            // Library methods.
            squareOfColor(color) {
                var colors = [
                    color.clone().codeSet(".")
                ];
                var pixelsForSquareWithInsetBorder = [
                    "."
                ];
                var image = this.imageBuildFromNameColorsAndPixelsAsStrings("Square", colors, pixelsForSquareWithInsetBorder);
                return image;
            }
            squareOfColorWithInsetBorderOfColor(colorSquare, colorBorder) {
                var colors = [
                    colorSquare.clone().codeSet("."),
                    colorBorder.clone().codeSet("#")
                ];
                var pixelsForSquareWithInsetBorder = [
                    "................",
                    ".##############.",
                    ".#............#.",
                    ".#............#.",
                    ".#............#.",
                    ".#............#.",
                    ".#............#.",
                    ".#............#.",
                    ".#............#.",
                    ".#............#.",
                    ".#............#.",
                    ".#............#.",
                    ".#............#.",
                    ".#............#.",
                    ".##############.",
                    "................",
                ];
                var image = this.imageBuildFromNameColorsAndPixelsAsStrings("SquareWithInsetBorder", colors, pixelsForSquareWithInsetBorder);
                return image;
            }
            wallMasonryWithColorsForBlocksAndMortar(colorBlock, colorMortar) {
                var colors = [
                    colorBlock.clone().codeSet("."),
                    colorMortar.clone().codeSet("#")
                ];
                var image = this.imageBuildFromNameColorsAndPixelsAsStrings("Wall", colors, [
                    "################",
                    "#...#...#...#...",
                    "#...#...#...#...",
                    "#...#...#...#...",
                    "################",
                    "..#...#...#...#.",
                    "..#...#...#...#.",
                    "..#...#...#...#.",
                    "################",
                    "#...#...#...#...",
                    "#...#...#...#...",
                    "#...#...#...#...",
                    "################",
                    "..#...#...#...#.",
                    "..#...#...#...#.",
                    "..#...#...#...#.",
                ]);
                return image;
            }
        }
        GameFramework.ImageBuilder = ImageBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
