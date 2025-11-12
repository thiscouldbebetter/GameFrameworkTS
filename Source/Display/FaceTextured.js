"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class FaceTextured extends GameFramework.Face {
            constructor(vertices, material) {
                super(vertices);
                this.material = material;
            }
        }
        GameFramework.FaceTextured = FaceTextured;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
