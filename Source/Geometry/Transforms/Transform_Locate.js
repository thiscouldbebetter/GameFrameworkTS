"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Transform_Locate {
            constructor(loc) {
                this.loc = loc || GameFramework.Disposition.blank();
                this.transformOrient = new GameFramework.Transform_Orient(null);
                this.transformTranslate = new GameFramework.Transform_Translate(null);
            }
            overwriteWith(other) {
                return this; // todo
            }
            transform(transformable) {
                return transformable.transform(this);
            }
            transformCoords(coordsToTransform) {
                this.transformOrient.orientation = this.loc.orientation;
                this.transformOrient.transformCoords(coordsToTransform);
                this.transformTranslate.displacement = this.loc.pos;
                this.transformTranslate.transformCoords(coordsToTransform);
                return coordsToTransform;
            }
        }
        GameFramework.Transform_Locate = Transform_Locate;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
