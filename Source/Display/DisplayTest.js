"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class DisplayTest {
            constructor(sizesAvailable, fontName, fontHeightInPixels, colorFore, colorBack, isInvisible) {
                this.sizesAvailable = sizesAvailable;
                this.fontName = fontName;
                this.fontHeightInPixels = fontHeightInPixels || 10;
                this.colorFore = colorFore;
                this.colorBack = colorBack;
                this.isInvisible = isInvisible || false;
                this.sizeInPixels = this.sizesAvailable[0].clone();
                this.sizeInPixelsHalf = this.sizeInPixels.clone().half();
            }
            static default() {
                return DisplayTest.fromSize(GameFramework.Coords.fromXY(100, 100));
            }
            static fromSize(size) {
                return new DisplayTest([size], null, null, null, null, false);
            }
            static fromSizeAndIsInvisible(size, isInvisible) {
                return new DisplayTest([size], null, null, null, null, isInvisible);
            }
            clear() { }
            displayToUse() {
                return this;
            }
            drawArc(center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder) { }
            drawBackground(colorBack, colorBorder) { }
            drawCircle(center, radius, colorFill, colorBorder, borderThickness) { }
            drawCircleWithGradient(center, radius, gradientFill, colorBorder) { }
            drawCrosshairs(center, numberOfLines, radiusOuter, radiusInner, color, lineThickness) { }
            drawEllipse(center, semimajorAxis, semiminorAxis, rotationInTurns, colorFill, colorBorder) { }
            drawImage(imageToDraw, pos) { }
            drawImagePartial(imageToDraw, pos, regionToDrawAsBox) { }
            drawImagePartialScaled(imageToDraw, pos, regionToDrawAsBox, sizeToDraw) { }
            drawImageScaled(imageToDraw, pos, size) { }
            drawLine(fromPos, toPos, color, lineThickness) { }
            drawMeshWithOrientation(mesh, meshOrientation) { }
            drawPath(vertices, color, lineThickness, isClosed) { }
            drawPixel(pos, color) { }
            drawPolygon(vertices, colorFill, colorBorder) { }
            drawRectangle(pos, size, colorFill, colorBorder) { }
            drawRectangleCentered(pos, size, colorFill, colorBorder) { }
            drawRectangleWithBeveledCorners(pos, size, colorFill, colorBorder, cornerRadius) { }
            drawRectangleWithRoundedCorners(pos, size, colorFill, colorBorder, cornerRadius) { }
            drawText(text, fontHeightInPixels, pos, colorFill, colorOutline, isCenteredHorizontally, isCenteredVertically, sizeMaxInPixels) { }
            drawWedge(center, radius, angleStartInTurns, angleStopInTurns, colorFill, colorBorder) { }
            eraseModeSet(value) { }
            fontSet(fontName, fontHeightInPixels) { }
            flush() { }
            hide(universe) { }
            initialize(universe) {
                return this;
            }
            rotateTurnsAroundCenter(turnsToRotate, centerOfRotation) { }
            sizeDefault() {
                return this.sizesAvailable[0];
            }
            scaleFactor() {
                return GameFramework.Coords.ones();
            }
            stateRestore() { }
            stateSave() { }
            textWidthForFontHeight(textToMeasure, fontHeightInPixels) {
                return fontHeightInPixels * textToMeasure.length;
            }
            toImage() {
                return null;
            }
            // platformable
            toDomElement() {
                if (this._domElement == null) {
                    this._domElement = document.createElement("div");
                }
                return this._domElement;
            }
        }
        GameFramework.DisplayTest = DisplayTest;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
