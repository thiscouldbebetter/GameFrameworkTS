"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class DisplayMock {
            constructor(sizesAvailable, fontNameAndHeight, colorFore, colorBack, isInvisible) {
                this.sizesAvailable = sizesAvailable;
                this.fontNameAndHeight =
                    fontNameAndHeight || GameFramework.FontNameAndHeight.default();
                this.colorFore = colorFore;
                this.colorBack = colorBack;
                this.isInvisible = isInvisible || false;
                this.sizeInPixels = this.sizesAvailable[0].clone();
                this.sizeInPixelsHalf = this.sizeInPixels.clone().half();
            }
            static default() {
                return DisplayMock.fromSize(Coords.fromXY(100, 100));
            }
            static fromSize(size) {
                return new DisplayMock([size], null, null, null, false);
            }
            static fromSizeAndIsInvisible(size, isInvisible) {
                return new DisplayMock([size], null, null, null, isInvisible);
            }
            clear() { }
            colorAtPos(pos, colorOut) {
                throw new Error("Not implemented!");
            }
            colorBackSet(value) {
                this.colorBack = value;
                return this;
            }
            colorForeSet(value) {
                this.colorFore = value;
                return this;
            }
            displayToUse() {
                return this;
            }
            drawArc(center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder) { }
            drawBackground() { }
            drawBackgroundWithColorsBackAndBorder(colorBack, colorBorder) { }
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
            drawTextWithFontAtPos(text, fontNameAndHeight, pos) { }
            drawTextWithFontAtPosWithColorsFillAndOutline(text, fontNameAndHeight, pos, colorFill, colorOutline, isCenteredHorizontally, isCenteredVertically, sizeMaxInPixels) { }
            drawWedge(center, radius, angleStartInTurns, angleStopInTurns, colorFill, colorBorder) { }
            eraseModeSet(value) { }
            fontSet(fontNameAndHeight) { }
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
                return Coords.ones();
            }
            stateRestore() { }
            stateSave() { }
            textWidthForFontHeight(textToMeasure, fontHeightInPixels) {
                return fontHeightInPixels * textToMeasure.length;
            }
            toImage(name) {
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
        GameFramework.DisplayMock = DisplayMock;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
