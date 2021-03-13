"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Cylinder {
            constructor(center, radius, length) {
                this.center = center;
                this.radius = radius;
                this.length = length;
                this.lengthHalf = this.length / 2;
            }
        }
        GameFramework.Cylinder = Cylinder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
