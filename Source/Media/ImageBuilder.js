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
            squareOfColorWithInsetBorderOfColor(colorCenterAndMargin, colorInsetBorder) {
                var colorCenterAndMarginCode = ".";
                var colorInsetBorderCode = "#";
                var colors = [
                    colorCenterAndMargin.clone().codeSet(colorCenterAndMarginCode),
                    colorInsetBorder.clone().codeSet(colorInsetBorderCode)
                ];
                var tileDimensionInPixels = 16;
                var tileSizeInPixels = GameFramework.Coords.ones().multiplyScalar(tileDimensionInPixels);
                var pixelRowTopAndBottomOfTile = "".padEnd(tileSizeInPixels.x, colorCenterAndMarginCode);
                var pixelRowTopAndBottomOfInsetBorder = colorCenterAndMarginCode
                    + "".padEnd(tileSizeInPixels.x - 2, colorInsetBorderCode)
                    + colorCenterAndMarginCode;
                var pixelRowCenter = colorCenterAndMarginCode
                    + colorInsetBorderCode
                    + "".padEnd(tileSizeInPixels.x - 4, colorCenterAndMarginCode)
                    + colorInsetBorderCode
                    + colorCenterAndMarginCode;
                var pixelsForSquareWithInsetBorder = [];
                pixelsForSquareWithInsetBorder.push(pixelRowTopAndBottomOfTile);
                pixelsForSquareWithInsetBorder.push(pixelRowTopAndBottomOfInsetBorder);
                for (var y = 0; y < tileSizeInPixels.y - 4; y++) {
                    pixelsForSquareWithInsetBorder.push(pixelRowCenter);
                }
                pixelsForSquareWithInsetBorder.push(pixelRowTopAndBottomOfInsetBorder);
                pixelsForSquareWithInsetBorder.push(pixelRowTopAndBottomOfTile);
                var image = this.imageBuildFromNameColorsAndPixelsAsStrings("SquareWithInsetBorder", colors, pixelsForSquareWithInsetBorder);
                return image;
            }
            wallMasonryWithColorsForBlocksAndMortar(colorBlock, colorMortar) {
                var colorBlockCode = ".";
                var colorMortarCode = "#";
                var colors = [
                    colorBlock.clone().codeSet(colorBlockCode),
                    colorMortar.clone().codeSet(colorMortarCode)
                ];
                var pixelsPerBlock = 16;
                var wallSizeInBlocks = GameFramework.Coords.ones().multiplyScalar(4);
                var blockSizeInPixels = GameFramework.Coords.ones().multiplyScalar(pixelsPerBlock);
                var wallSizeInPixels = wallSizeInBlocks.clone().multiply(blockSizeInPixels);
                var pixelRowAsStringForMortar = "".padEnd(wallSizeInPixels.x, colorMortarCode);
                // Even course.
                var pixelStringForBlockThenMortarEven = "".padEnd(blockSizeInPixels.x - 1, colorBlockCode) + colorMortarCode;
                var pixelRowAsStringForBlocksAndMortarEven = "";
                for (var x = 0; x < wallSizeInBlocks.x; x++) {
                    pixelRowAsStringForBlocksAndMortarEven += pixelStringForBlockThenMortarEven;
                }
                var courseAsStringsEven = [pixelRowAsStringForMortar];
                for (var y = 1; y < blockSizeInPixels.y; y++) {
                    courseAsStringsEven.push(pixelRowAsStringForBlocksAndMortarEven);
                }
                // Odd course.
                var pixelRowAsStringForBlocksAndMortarOdd = pixelRowAsStringForBlocksAndMortarEven
                    .substring(Math.round(blockSizeInPixels.x / 2))
                    .padEnd(wallSizeInPixels.x, colorBlockCode);
                var courseAsStringsOdd = [pixelRowAsStringForMortar];
                for (var y = 1; y < blockSizeInPixels.y; y++) {
                    courseAsStringsOdd.push(pixelRowAsStringForBlocksAndMortarOdd);
                }
                var pixelsAsStrings = [];
                for (var courseY = 0; courseY < wallSizeInBlocks.y; courseY++) {
                    var courseIsEven = (courseY % 2) == 0;
                    var courseAsStrings = courseIsEven
                        ? courseAsStringsEven
                        : courseAsStringsOdd;
                    pixelsAsStrings.push(...courseAsStrings);
                }
                var image = this.imageBuildFromNameColorsAndPixelsAsStrings("Wall", colors, pixelsAsStrings);
                return image;
            }
        }
        GameFramework.ImageBuilder = ImageBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
