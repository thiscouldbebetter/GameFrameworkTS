"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualPolygon {
            constructor(verticesAsPath, colorFill, colorBorder, shouldUseEntityOrientation) {
                this.verticesAsPath = verticesAsPath;
                this.colorFill = colorFill;
                this.colorBorder = colorBorder;
                this.shouldUseEntityOrientation =
                    (shouldUseEntityOrientation == null ? true : shouldUseEntityOrientation);
                this.verticesAsPathTransformed = this.verticesAsPath.clone();
                this.transformLocate = new GameFramework.Transform_Locate(null);
            }
            static arrow(width, length, headingInTurns, colorFill, colorBorder) {
                var pathArrow = GameFramework.Path.arrowOfWidthAndLength(width, length);
                var transform = new GameFramework.Transform_Rotate2D(headingInTurns);
                pathArrow.transform(transform);
                var returnValue = new VisualPolygon(pathArrow, colorFill, colorBorder, null);
                return returnValue;
            }
            static default() {
                return VisualPolygon.fromDimensionAndColorBorder(10, GameFramework.Color.Instances().Cyan);
            }
            static fromColorBorder(colorBorder) {
                return VisualPolygon.fromDimensionAndColorBorder(10, colorBorder);
            }
            static fromDimensionAndColorBorder(dimension, colorBorder) {
                return VisualPolygon.fromPathAndColorsFillAndBorder(GameFramework.Path.fromDimension(dimension), null, // colorFill
                colorBorder);
            }
            static fromPathAndColorFill(path, colorFill) {
                var returnValue = new VisualPolygon(path, colorFill, null, null // shouldUseEntityOrientation
                );
                return returnValue;
            }
            static fromPathAndColorsFillAndBorder(verticesAsPath, colorFill, colorBorder) {
                return new VisualPolygon(verticesAsPath, colorFill, colorBorder, null);
            }
            static fromVerticesAndColorFill(vertices, colorFill) {
                var verticesAsPath = new GameFramework.Path(vertices);
                return VisualPolygon.fromPathAndColorFill(verticesAsPath, colorFill);
            }
            // Visual.
            initialize(uwpe) {
                // Do nothing.
            }
            initializeIsComplete(uwpe) {
                return true;
            }
            draw(uwpe, display) {
                var entity = uwpe.entity;
                var drawableLoc = GameFramework.Locatable.of(entity).loc;
                this.transformLocate.loc.overwriteWith(drawableLoc);
                if (this.shouldUseEntityOrientation == false) {
                    this.transformLocate.loc.orientation.default();
                }
                this.verticesAsPathTransformed.overwriteWith(this.verticesAsPath);
                GameFramework.Transforms.applyTransformToCoordsMany(this.transformLocate, this.verticesAsPathTransformed.points);
                display.drawPolygon(this.verticesAsPathTransformed.points, this.colorFill, this.colorBorder);
            }
            shouldUseEntityOrientationSet(value) {
                this.shouldUseEntityOrientation = value;
                return this;
            }
            // Clonable.
            clone() {
                return new VisualPolygon(this.verticesAsPath.clone(), GameFramework.ClonableHelper.clone(this.colorFill), GameFramework.ClonableHelper.clone(this.colorBorder), this.shouldUseEntityOrientation);
            }
            overwriteWith(other) {
                var otherAsVisualPolygon = other;
                this.verticesAsPath.overwriteWith(otherAsVisualPolygon.verticesAsPath);
                if (this.colorFill != null) {
                    this.colorFill.overwriteWith(otherAsVisualPolygon.colorFill);
                }
                if (this.colorBorder != null) {
                    this.colorBorder.overwriteWith(otherAsVisualPolygon.colorBorder);
                }
                this.shouldUseEntityOrientation = other.shouldUseEntityOrientation;
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                this.verticesAsPath.transform(transformToApply);
                return this;
            }
        }
        GameFramework.VisualPolygon = VisualPolygon;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
