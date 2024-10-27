"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualRectangle {
            constructor(size, colorFill, colorBorder, isCentered) {
                this.size = size;
                this.colorFill = colorFill;
                this.colorBorder = colorBorder;
                this.isCentered = isCentered || true;
                this.sizeHalf = this.size.clone().half();
                this._drawPos = GameFramework.Coords.create();
            }
            static default() {
                // For rapid prototyping.
                return VisualRectangle.fromColorFill(GameFramework.Color.Instances().Cyan);
            }
            static fromColorFill(colorFill) {
                // For rapid prototyping.
                return new VisualRectangle(GameFramework.Coords.fromXY(1, 1).multiplyScalar(10), null, colorFill, true);
            }
            static fromColorFillAndSize(colorFill, size) {
                return VisualRectangle.fromSizeAndColorFill(size, colorFill);
            }
            static fromSizeAndColorBorder(size, colorBorder) {
                return new VisualRectangle(size, null, colorBorder, null);
            }
            static fromSizeAndColorFill(size, colorFill) {
                return new VisualRectangle(size, colorFill, null, null);
            }
            static fromSizeAndColorsFillAndBorder(size, colorFill, colorBorder) {
                return new VisualRectangle(size, colorFill, colorBorder, null);
            }
            draw(uwpe, display) {
                var entity = uwpe.entity;
                var drawPos = this._drawPos.overwriteWith(entity.locatable().loc.pos);
                if (this.isCentered) {
                    drawPos.subtract(this.sizeHalf);
                }
                display.drawRectangle(drawPos, this.size, this.colorFill, this.colorBorder);
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
        GameFramework.VisualRectangle = VisualRectangle;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
