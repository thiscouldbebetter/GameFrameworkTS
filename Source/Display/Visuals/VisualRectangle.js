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
            static fromSizeAndColorFill(size, colorFill) {
                return new VisualRectangle(size, colorFill, null, null);
            }
            draw(universe, world, place, entity, display) {
                var drawPos = this._drawPos.overwriteWith(entity.locatable().loc.pos);
                if (this.isCentered) {
                    drawPos.subtract(this.sizeHalf);
                }
                display.drawRectangle(drawPos, this.size, this.colorFill, this.colorBorder, null);
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
