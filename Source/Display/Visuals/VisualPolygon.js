"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualPolygon {
            constructor(verticesAsPath, colorFill, colorBorder) {
                this.verticesAsPath = verticesAsPath;
                this.colorFill = colorFill;
                this.colorBorder = colorBorder;
                this.verticesAsPathTransformed = this.verticesAsPath.clone();
                this.transformLocate = new GameFramework.Transform_Locate(null);
            }
            draw(universe, world, place, entity, display) {
                var drawableLoc = entity.locatable().loc;
                this.transformLocate.loc.overwriteWith(drawableLoc);
                this.verticesAsPathTransformed.overwriteWith(this.verticesAsPath);
                GameFramework.Transforms.applyTransformToCoordsMany(this.transformLocate, this.verticesAsPathTransformed.points);
                display.drawPolygon(this.verticesAsPathTransformed.points, GameFramework.Color.systemColorGet(this.colorFill), GameFramework.Color.systemColorGet(this.colorBorder));
            }
            // Clonable.
            clone() {
                return new VisualPolygon(this.verticesAsPath.clone(), GameFramework.ClonableHelper.clone(this.colorFill), GameFramework.ClonableHelper.clone(this.colorBorder));
            }
            overwriteWith(other) {
                var otherAsVisualPolygon = other;
                GameFramework.ArrayHelper.overwriteWith(this.verticesAsPath, otherAsVisualPolygon.verticesAsPath);
                if (this.colorFill != null) {
                    this.colorFill.overwriteWith(otherAsVisualPolygon.colorFill);
                }
                if (this.colorBorder != null) {
                    this.colorBorder.overwriteWith(otherAsVisualPolygon.colorBorder);
                }
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
