"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class ShapeHelper {
            constructor() {
                this._transformLocate = new GameFramework.Transform_Locate(null);
            }
            static Instance() {
                if (ShapeHelper._instance == null) {
                    ShapeHelper._instance = new ShapeHelper();
                }
                return ShapeHelper._instance;
            }
            applyLocationToShapeDefault(loc, shape) {
                this._transformLocate.loc = loc;
                GameFramework.Transforms.applyTransformToCoordsMany(this._transformLocate, shape.coordsGroupToTranslate());
                return shape;
            }
        }
        GameFramework.ShapeHelper = ShapeHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
