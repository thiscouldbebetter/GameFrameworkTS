"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class DisplayFarToNear {
            constructor(displayInner) {
                this.displayInner = displayInner;
                this.sizesAvailable = displayInner.sizesAvailable;
                this.fontNameAndHeight =
                    displayInner.fontNameAndHeight;
                this.colorFore = displayInner.colorFore;
                this.colorBack = displayInner.colorBack;
                this.isInvisible = displayInner.isInvisible;
                this.sizeInPixels = displayInner.sizeInPixels;
                this.sizeInPixelsHalf = displayInner.sizeInPixelsHalf;
                this.drawMethodAndDistancePairs = new Array();
            }
            drawMethodAddAtDistance(distance, drawMethod) {
                var drawMethodAndDistancePairs = this.drawMethodAndDistancePairs;
                var i = 0;
                for (var i = 0; i < drawMethodAndDistancePairs.length; i++) {
                    var drawMethodAndDistancePairExisting = drawMethodAndDistancePairs[i];
                    var distanceExisting = drawMethodAndDistancePairExisting[1];
                    if (distance > distanceExisting) // Using ">" rather than ">=" preserves the order of multiple visuals for same drawable.
                     {
                        break;
                    }
                }
                var drawMethodAndDistance = [drawMethod, distance];
                drawMethodAndDistancePairs.splice(i, 0, drawMethodAndDistance);
            }
            // Display.
            clear() {
                this.displayInner.clear();
                this.drawMethodAndDistancePairs.length = 0;
            }
            colorAtPos(pos, colorOut) {
                return this.displayInner.colorAtPos(pos, colorOut);
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
                return this.displayInner.displayToUse();
            }
            drawArc(center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder) {
                center = center.clone();
                this.drawMethodAddAtDistance(center.z, () => this.displayInner.drawArc(center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder));
            }
            drawBackground() {
                this.drawBackgroundWithColorsBackAndBorder(this.colorBack, this.colorFore);
            }
            drawBackgroundWithColorsBackAndBorder(colorBack, colorBorder) {
                this.drawMethodAddAtDistance(Number.POSITIVE_INFINITY, () => this.displayInner.drawBackgroundWithColorsBackAndBorder(colorBack, colorBorder));
            }
            drawCircle(center, radius, colorFill, colorBorder, borderThickness) {
                center = center.clone();
                this.drawMethodAddAtDistance(center.z, () => this.displayInner.drawCircle(center, radius, colorFill, colorBorder, borderThickness));
            }
            drawCircleWithGradient(center, radius, gradientFill, colorBorder) {
                center = center.clone();
                this.drawMethodAddAtDistance(center.z, () => this.displayInner.drawCircleWithGradient(center, radius, gradientFill, colorBorder));
            }
            drawCrosshairs(center, numberOfLines, radiusOuter, radiusInner, color, lineThickness) {
                center = center.clone();
                this.drawMethodAddAtDistance(center.z, () => this.displayInner.drawCrosshairs(center, numberOfLines, radiusOuter, radiusInner, color, lineThickness));
            }
            drawEllipse(center, semimajorAxis, semiminorAxis, rotationInTurns, colorFill, colorBorder) {
                center = center.clone();
                this.drawMethodAddAtDistance(center.z, () => this.displayInner.drawEllipse(center, semimajorAxis, semiminorAxis, rotationInTurns, colorFill, colorBorder));
            }
            drawImage(imageToDraw, pos) {
                pos = pos.clone();
                this.drawMethodAddAtDistance(pos.z, () => this.displayInner.drawImage(imageToDraw, pos));
            }
            drawImagePartial(imageToDraw, pos, regionToDrawAsBox) {
                pos = pos.clone();
                this.drawMethodAddAtDistance(pos.z, () => this.displayInner.drawImagePartial(imageToDraw, pos, regionToDrawAsBox));
            }
            drawImagePartialScaled(imageToDraw, pos, regionToDrawAsBox, sizeToDraw) {
                pos = pos.clone();
                this.drawMethodAddAtDistance(pos.z, () => this.displayInner.drawImagePartialScaled(imageToDraw, pos, regionToDrawAsBox, sizeToDraw));
            }
            drawImageScaled(imageToDraw, pos, size) {
                pos = pos.clone();
                this.drawMethodAddAtDistance(pos.z, () => this.displayInner.drawImageScaled(imageToDraw, pos, size));
            }
            drawLine(fromPos, toPos, color, lineThickness) {
                fromPos = fromPos.clone();
                toPos = toPos.clone();
                this.drawMethodAddAtDistance(fromPos.z, () => this.displayInner.drawLine(fromPos, toPos, color, lineThickness));
            }
            drawMeshWithOrientation(mesh, meshOrientation) {
                var pos = mesh.geometry.vertices()[0];
                this.drawMethodAddAtDistance(pos.z, // hack
                () => this.displayInner.drawMeshWithOrientation(mesh, meshOrientation));
            }
            drawPath(vertices, color, lineThickness, isClosed) {
                this.drawMethodAddAtDistance(vertices[0].z, // hack
                () => this.displayInner.drawPath(vertices, color, lineThickness, isClosed));
            }
            drawPixel(pos, color) {
                pos = pos.clone();
                this.drawMethodAddAtDistance(pos.z, () => this.displayInner.drawPixel(pos, color));
            }
            drawPolygon(vertices, colorFill, colorBorder) {
                this.drawMethodAddAtDistance(vertices[0].z, // hack
                () => this.displayInner.drawPolygon(vertices, colorFill, colorBorder));
            }
            drawRectangle(pos, size, colorFill, colorBorder) {
                pos = pos.clone();
                this.drawMethodAddAtDistance(pos.z, () => this.displayInner.drawRectangle(pos, size, colorFill, colorBorder));
            }
            drawRectangleCentered(pos, size, colorFill, colorBorder) {
                pos = pos.clone();
                this.drawMethodAddAtDistance(pos.z, () => this.displayInner.drawRectangleCentered(pos, size, colorFill, colorBorder));
            }
            drawRectangleWithBeveledCorners(pos, size, colorFill, colorBorder, cornerRadius) {
                pos = pos.clone();
                this.drawMethodAddAtDistance(pos.z, () => this.displayInner.drawRectangleWithBeveledCorners(pos, size, colorFill, colorBorder, cornerRadius));
            }
            drawRectangleWithRoundedCorners(pos, size, colorFill, colorBorder, cornerRadius) {
                pos = pos.clone();
                this.drawMethodAddAtDistance(pos.z, () => this.displayInner.drawRectangleWithRoundedCorners(pos, size, colorFill, colorBorder, cornerRadius));
            }
            drawText(text, fontNameAndHeight, pos, colorFill, colorOutline, isCenteredHorizontally, isCenteredVertically, sizeMaxInPixels) {
                pos = pos.clone();
                this.drawMethodAddAtDistance(pos.z, () => this.displayInner.drawText(text, fontNameAndHeight, pos, colorFill, colorOutline, isCenteredHorizontally, isCenteredVertically, sizeMaxInPixels));
            }
            drawWedge(center, radius, angleStartInTurns, angleStopInTurns, colorFill, colorBorder) {
                center = center.clone();
                this.drawMethodAddAtDistance(center.z, () => this.displayInner.drawWedge(center, radius, angleStartInTurns, angleStopInTurns, colorFill, colorBorder));
            }
            eraseModeSet(value) {
                throw new Error("Not supported: DisplayFarToNear.eraseModeSet().");
            }
            fontSet(fontNameAndHeight) {
                this.displayInner.fontSet(fontNameAndHeight);
            }
            flush() {
                this.drawMethodAndDistancePairs.forEach(x => x[0]());
            }
            hide(universe) {
                this.displayInner.hide(universe);
            }
            initialize(universe) {
                return this.displayInner.initialize(universe);
            }
            rotateTurnsAroundCenter(turnsToRotate, centerOfRotation) {
                throw new Error("Not supported: DisplayFarToNear.rotateTurnsAroundCenter().");
            }
            sizeDefault() {
                return this.displayInner.sizeDefault();
            }
            scaleFactor() {
                return this.displayInner.scaleFactor();
            }
            stateRestore() {
                throw new Error("Not supported: DisplayFarToNear.stateRestore().");
            }
            stateSave() {
                throw new Error("Not supported: DisplayFarToNear.stateSave().");
            }
            textWidthForFontHeight(textToMeasure, fontHeightInPixels) {
                return this.displayInner.textWidthForFontHeight(textToMeasure, fontHeightInPixels);
            }
            toImage(name) {
                return this.displayInner.toImage(name);
            }
            // platformable
            toDomElement() {
                return this.displayInner.toDomElement();
            }
        }
        GameFramework.DisplayFarToNear = DisplayFarToNear;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
