"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Display2D {
            constructor(sizesAvailable, fontName, fontHeightInPixels, colorFore, colorBack, isInvisible) {
                this.sizesAvailable = sizesAvailable;
                this._sizeDefault = this.sizesAvailable[0];
                this.sizeInPixels = this._sizeDefault;
                this.fontName = fontName;
                this.fontHeightInPixels = fontHeightInPixels || 10;
                this.colorFore = colorFore;
                this.colorBack = colorBack;
                this.isInvisible = isInvisible || false;
                // Helper variables.
                this._drawPos = GameFramework.Coords.create();
                this._sizeHalf = GameFramework.Coords.create();
                this._zeroes = GameFramework.Coords.Instances().Zeroes;
            }
            static fromSize(size) {
                return new Display2D([size], null, null, null, null, false);
            }
            static fromSizeAndIsInvisible(size, isInvisible) {
                return new Display2D([size], null, null, null, null, isInvisible);
            }
            clear() {
                this.graphics.clearRect(0, 0, this.sizeInPixels.x, this.sizeInPixels.y);
            }
            displayToUse() {
                return this;
            }
            drawArc(center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder) {
                var drawPos = this._drawPos.overwriteWith(center);
                var angleStartInRadians = angleStartInTurns * Display2D.RadiansPerTurn;
                var angleStopInRadians = angleStopInTurns * Display2D.RadiansPerTurn;
                if (colorFill != null) {
                    this.graphics.fillStyle = GameFramework.Color.systemColorGet(colorFill);
                    this.graphics.beginPath();
                    this.graphics.arc(center.x, center.y, radiusInner, angleStartInRadians, angleStopInRadians);
                    drawPos.overwriteWith(center).add(new GameFramework.Polar(angleStopInTurns, radiusOuter, 0).toCoords(GameFramework.Coords.create()));
                    this.graphics.lineTo(drawPos.x, drawPos.y);
                    this.graphics.arc(center.x, center.y, radiusOuter, angleStopInRadians, angleStartInRadians, true // counterclockwise
                    );
                    this.graphics.closePath();
                    this.graphics.fill();
                }
                if (colorBorder != null) {
                    this.graphics.strokeStyle = GameFramework.Color.systemColorGet(colorBorder);
                    this.graphics.beginPath();
                    this.graphics.arc(center.x, center.y, radiusInner, angleStartInRadians, angleStopInRadians);
                    drawPos.overwriteWith(center).add(new GameFramework.Polar(angleStopInTurns, radiusOuter, 0).toCoords(GameFramework.Coords.create()));
                    this.graphics.lineTo(drawPos.x, drawPos.y);
                    this.graphics.arc(center.x, center.y, radiusOuter, angleStopInRadians, angleStartInRadians, true // counterclockwise
                    );
                    this.graphics.closePath();
                    this.graphics.stroke();
                }
            }
            drawBackground(colorBack, colorBorder) {
                this.drawRectangle(this._zeroes, this.sizeDefault(), // Automatic scaling.
                colorBack || this.colorBack, colorBorder || this.colorFore, null);
            }
            drawCircle(center, radius, colorFill, colorBorder, borderThickness) {
                var drawPos = this._drawPos.overwriteWith(center);
                this.graphics.beginPath();
                this.graphics.arc(drawPos.x, drawPos.y, radius, 0, Display2D.RadiansPerTurn);
                if (colorFill != null) {
                    this.graphics.fillStyle = GameFramework.Color.systemColorGet(colorFill);
                    this.graphics.fill();
                }
                if (colorBorder != null) {
                    var lineWidthToRestore = this.graphics.lineWidth;
                    this.graphics.lineWidth = borderThickness;
                    this.graphics.strokeStyle = GameFramework.Color.systemColorGet(colorBorder);
                    this.graphics.stroke();
                    this.graphics.lineWidth = lineWidthToRestore;
                }
            }
            drawCircleWithGradient(center, radius, gradientFill, colorBorder) {
                this.graphics.beginPath();
                this.graphics.arc(center.x, center.y, radius, 0, Display2D.RadiansPerTurn);
                var systemGradient = this.graphics.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
                var gradientStops = gradientFill.stops;
                for (var i = 0; i < gradientStops.length; i++) {
                    var stop = gradientStops[i];
                    var stopColor = stop.value;
                    systemGradient.addColorStop(stop.position, stopColor.systemColor());
                }
                this.graphics.fillStyle = systemGradient;
                this.graphics.fill();
                if (colorBorder != null) {
                    this.graphics.strokeStyle = GameFramework.Color.systemColorGet(colorBorder);
                    this.graphics.stroke();
                }
            }
            drawCrosshairs(center, numberOfLines, radiusOuter, radiusInner, color, lineThickness) {
                var drawPos = this._drawPos;
                var g = this.graphics;
                g.beginPath();
                g.strokeStyle = GameFramework.Color.systemColorGet(color);
                g.lineWidth = lineThickness;
                var polarForLine = GameFramework.Polar.default();
                var offset = GameFramework.Coords.create();
                for (var i = 0; i < numberOfLines; i++) {
                    polarForLine.azimuthInTurns = GameFramework.NumberHelper.wrapToRangeMax(.75 + i / numberOfLines, 1);
                    polarForLine.radius = radiusInner;
                    drawPos.overwriteWith(center).add(polarForLine.toCoords(offset));
                    g.moveTo(drawPos.x, drawPos.y);
                    polarForLine.radius = radiusOuter;
                    drawPos.overwriteWith(center).add(polarForLine.toCoords(offset));
                    g.lineTo(drawPos.x, drawPos.y);
                }
                g.stroke();
            }
            drawEllipse(center, semimajorAxis, semiminorAxis, rotationInTurns, colorFill, colorBorder) {
                this.graphics.save();
                this.graphics.translate(center.x, center.y);
                var rotationInRadians = rotationInTurns * GameFramework.Polar.RadiansPerTurn;
                this.graphics.rotate(rotationInRadians);
                var ratioOfHeightToWidth = semiminorAxis / semimajorAxis;
                this.graphics.scale(1, ratioOfHeightToWidth);
                this.graphics.beginPath();
                this.graphics.arc(0, 0, // center
                semimajorAxis, // "radius"
                0, Math.PI * 2.0 // start, stop angle
                );
                if (colorFill != null) {
                    this.graphics.fillStyle = GameFramework.Color.systemColorGet(colorFill);
                    this.graphics.fill();
                }
                if (colorBorder != null) {
                    this.graphics.strokeStyle = GameFramework.Color.systemColorGet(colorBorder);
                    this.graphics.stroke();
                }
                this.graphics.restore();
            }
            drawImage(imageToDraw, pos) {
                this.graphics.drawImage(imageToDraw.systemImage, pos.x, pos.y);
            }
            drawImagePartial(imageToDraw, pos, regionToDrawAsBox) {
                this.drawImagePartialScaled(imageToDraw, pos, regionToDrawAsBox, null);
            }
            drawImagePartialScaled(imageToDraw, pos, regionToDrawAsBox, sizeToDraw) {
                var sourcePos = regionToDrawAsBox.min();
                var sourceSize = regionToDrawAsBox.size;
                if (sizeToDraw == null) {
                    sizeToDraw = sourceSize;
                }
                this.graphics.drawImage(imageToDraw.systemImage, sourcePos.x, sourcePos.y, sourceSize.x, sourceSize.y, pos.x, pos.y, sizeToDraw.x, sizeToDraw.y);
            }
            drawImageScaled(imageToDraw, pos, size) {
                this.graphics.drawImage(imageToDraw.systemImage, pos.x, pos.y, size.x, size.y);
            }
            drawLine(fromPos, toPos, color, lineThickness) {
                var drawPos = this._drawPos;
                this.graphics.strokeStyle = GameFramework.Color.systemColorGet(color);
                var lineWidthToRestore = this.graphics.lineWidth;
                if (lineThickness != null) {
                    this.graphics.lineWidth = lineThickness;
                }
                this.graphics.beginPath();
                drawPos.overwriteWith(fromPos);
                this.graphics.moveTo(drawPos.x, drawPos.y);
                drawPos.overwriteWith(toPos);
                this.graphics.lineTo(drawPos.x, drawPos.y);
                this.graphics.stroke();
                this.graphics.lineWidth = lineWidthToRestore;
            }
            drawMeshWithOrientation(mesh, meshOrientation) {
                // todo
            }
            drawPath(vertices, color, lineThickness, isClosed) {
                var lineWidthSaved = this.graphics.lineWidth;
                this.graphics.lineWidth = (lineThickness == null ? 1 : lineThickness);
                this.graphics.beginPath();
                var drawPos = this._drawPos;
                for (var i = 0; i < vertices.length; i++) {
                    var vertex = vertices[i];
                    drawPos.overwriteWith(vertex);
                    if (i == 0) {
                        this.graphics.moveTo(drawPos.x, drawPos.y);
                    }
                    else {
                        this.graphics.lineTo(drawPos.x, drawPos.y);
                    }
                }
                if (isClosed) {
                    this.graphics.closePath();
                }
                this.graphics.strokeStyle = GameFramework.Color.systemColorGet(color);
                this.graphics.stroke();
                this.graphics.lineWidth = lineWidthSaved;
            }
            drawPixel(pos, color) {
                this.graphics.fillStyle = GameFramework.Color.systemColorGet(color);
                this.graphics.fillRect(pos.x, pos.y, 1, 1);
            }
            drawPolygon(vertices, colorFill, colorBorder) {
                this.graphics.beginPath();
                var drawPos = this._drawPos;
                for (var i = 0; i < vertices.length; i++) {
                    var vertex = vertices[i];
                    drawPos.overwriteWith(vertex);
                    if (i == 0) {
                        this.graphics.moveTo(drawPos.x, drawPos.y);
                    }
                    else {
                        this.graphics.lineTo(drawPos.x, drawPos.y);
                    }
                }
                this.graphics.closePath();
                if (colorFill != null) {
                    this.graphics.fillStyle = GameFramework.Color.systemColorGet(colorFill);
                    this.graphics.fill();
                }
                if (colorBorder != null) {
                    this.graphics.strokeStyle = GameFramework.Color.systemColorGet(colorBorder);
                    this.graphics.stroke();
                }
            }
            drawRectangle(pos, size, colorFill, colorBorder, areColorsReversed) {
                if (areColorsReversed) {
                    var temp = colorFill;
                    colorFill = colorBorder;
                    colorBorder = temp;
                }
                if (colorFill != null) {
                    this.graphics.fillStyle = GameFramework.Color.systemColorGet(colorFill);
                    this.graphics.fillRect(pos.x, pos.y, size.x, size.y);
                }
                if (colorBorder != null) {
                    this.graphics.strokeStyle = GameFramework.Color.systemColorGet(colorBorder);
                    this.graphics.strokeRect(pos.x, pos.y, size.x, size.y);
                }
            }
            drawRectangleCentered(pos, size, colorFill, colorBorder) {
                var sizeHalf = this._sizeHalf.overwriteWith(size).half();
                var posAdjusted = this._drawPos.overwriteWith(pos).subtract(sizeHalf);
                this.drawRectangle(posAdjusted, size, colorFill, colorBorder, null);
            }
            drawText(text, fontHeightInPixels, pos, colorFill, colorOutline, areColorsReversed, isCentered, widthMaxInPixels) {
                var fontToRestore = this.graphics.font;
                if (fontHeightInPixels == null) {
                    fontHeightInPixels = this.fontHeightInPixels;
                }
                this.fontSet(null, fontHeightInPixels);
                if (areColorsReversed) {
                    var temp = colorFill;
                    colorFill = colorOutline;
                    colorOutline = temp;
                }
                if (colorFill == null) {
                    colorFill = this.colorFore;
                }
                this.graphics.fillStyle = GameFramework.Color.systemColorGet(colorFill);
                var drawPos = new GameFramework.Coords(pos.x, pos.y + fontHeightInPixels, 0);
                var textAsLines = text.split("\n");
                for (var i = 0; i < textAsLines.length; i++) {
                    var textLine = textAsLines[i];
                    var textTrimmed = textLine;
                    if (widthMaxInPixels != null) {
                        while (this.textWidthForFontHeight(textTrimmed, fontHeightInPixels) > widthMaxInPixels) {
                            textTrimmed = textTrimmed.substr(0, textTrimmed.length - 1);
                        }
                    }
                    var textWidthInPixels = this.textWidthForFontHeight(textTrimmed, fontHeightInPixels);
                    if (isCentered) {
                        drawPos.addDimensions(0 - textWidthInPixels / 2, 0 - (fontHeightInPixels / 2) * 1.2, // hack
                        0);
                    }
                    if (colorOutline != null) {
                        this.graphics.strokeStyle = GameFramework.Color.systemColorGet(colorOutline);
                        this.graphics.strokeText(textTrimmed, drawPos.x, drawPos.y);
                    }
                    this.graphics.fillText(textTrimmed, drawPos.x, drawPos.y);
                    drawPos.y += fontHeightInPixels;
                }
                this.graphics.font = fontToRestore;
            }
            drawWedge(center, radius, angleStartInTurns, angleStopInTurns, colorFill, colorBorder) {
                var drawPos = this._drawPos.overwriteWith(center);
                var angleStartInRadians = angleStartInTurns * Display2D.RadiansPerTurn;
                var angleStopInRadians = angleStopInTurns * Display2D.RadiansPerTurn;
                if (colorFill != null) {
                    this.graphics.fillStyle = GameFramework.Color.systemColorGet(colorFill);
                    this.graphics.beginPath();
                    this.graphics.moveTo(center.x, center.y);
                    drawPos.overwriteWith(center).add(new GameFramework.Polar(angleStopInTurns, radius, 0).toCoords(GameFramework.Coords.create()));
                    this.graphics.lineTo(drawPos.x, drawPos.y);
                    this.graphics.arc(center.x, center.y, radius, angleStopInRadians, angleStartInRadians, true // counterclockwise
                    );
                    this.graphics.closePath();
                    this.graphics.fill();
                }
                if (colorBorder != null) {
                    this.graphics.strokeStyle = GameFramework.Color.systemColorGet(colorBorder);
                    this.graphics.beginPath();
                    this.graphics.moveTo(center.x, center.y);
                    drawPos.overwriteWith(center).add(new GameFramework.Polar(angleStopInTurns, radius, 0).toCoords(GameFramework.Coords.create()));
                    this.graphics.lineTo(drawPos.x, drawPos.y);
                    this.graphics.arc(center.x, center.y, radius, angleStopInRadians, angleStartInRadians, true // counterclockwise
                    );
                    this.graphics.closePath();
                    this.graphics.stroke();
                }
            }
            eraseModeSet(value) {
                if (value) {
                    this.graphics.globalCompositeOperation = "destination-out"; // todo - ?
                }
                else {
                    this.graphics.globalCompositeOperation = "source-atop";
                }
            }
            fontSet(fontName, fontHeightInPixels) {
                if (fontName != this.fontName || fontHeightInPixels != this.fontHeightInPixels) {
                    this.fontName = fontName || this.fontName;
                    this.fontHeightInPixels = fontHeightInPixels || this.fontHeightInPixels;
                    this.graphics.font = this.fontHeightInPixels + "px " + this.fontName;
                }
            }
            flush() { }
            hide(universe) {
                universe.platformHelper.platformableRemove(this);
            }
            initialize(universe) {
                if (this.isInvisible) {
                    this.toDomElement();
                }
                else if (universe == null) {
                    // hack - Allows use of this class
                    // without including PlatformHelper or Universe.
                    var domElement = this.toDomElement();
                    var divMain = document.getElementById("divMain");
                    if (divMain == null) {
                        divMain = document.createElement("div");
                        divMain.id = "divMain";
                        document.body.appendChild(divMain);
                    }
                    divMain.appendChild(domElement);
                }
                else {
                    universe.platformHelper.platformableAdd(this);
                }
                return this;
            }
            rotateTurnsAroundCenter(turnsToRotate, centerOfRotation) {
                var graphics = this.graphics;
                graphics.translate(centerOfRotation.x, centerOfRotation.y);
                var rotationInRadians = turnsToRotate * GameFramework.Polar.RadiansPerTurn;
                graphics.rotate(rotationInRadians);
                graphics.translate(0 - centerOfRotation.x, 0 - centerOfRotation.y);
            }
            sizeDefault() {
                return this._sizeDefault;
            }
            scaleFactor() {
                if (this._scaleFactor == null) {
                    var sizeBase = this.sizesAvailable[0];
                    this._scaleFactor = this.sizeInPixels.clone().divide(sizeBase);
                }
                return this._scaleFactor;
            }
            stateRestore() {
                this.graphics.restore();
            }
            stateSave() {
                this.graphics.save();
            }
            textWidthForFontHeight(textToMeasure, fontHeightInPixels) {
                var fontToRestore = this.graphics.font;
                this.fontSet(null, fontHeightInPixels);
                var returnValue = this.graphics.measureText(textToMeasure).width;
                this.graphics.font = fontToRestore;
                return returnValue;
            }
            toImage() {
                return GameFramework.Image2.fromSystemImage("[fromDisplay]", this.canvas);
            }
            // platformable
            toDomElement() {
                if (this.canvas == null) {
                    this.canvas = document.createElement("canvas");
                    this.canvas.width = this.sizeInPixels.x;
                    this.canvas.height = this.sizeInPixels.y;
                    this.canvas.oncontextmenu = () => false;
                    this.graphics = this.canvas.getContext("2d");
                    this.fontSet(null, this.fontHeightInPixels);
                    // todo
                    // var testString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    // var widthWithFontFallthrough = this.graphics.measureText(testString).width;
                    this._scaleFactor = null;
                    var scaleFactor = this.scaleFactor();
                    this.graphics.scale(scaleFactor.x, scaleFactor.y);
                }
                return this.canvas;
            }
        }
        // constants
        Display2D.RadiansPerTurn = Math.PI * 2.0;
        GameFramework.Display2D = Display2D;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
