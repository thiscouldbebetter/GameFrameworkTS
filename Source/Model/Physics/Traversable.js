"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Traversable extends GameFramework.EntityProperty {
            constructor(isBlocking) {
                super();
                this.isBlocking = isBlocking;
            }
        }
        GameFramework.Traversable = Traversable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
