"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Traversable extends GameFramework.EntityPropertyBase {
            constructor(isBlocking) {
                super();
                this.isBlocking = isBlocking;
            }
            static of(entity) {
                return entity.propertyByName(Traversable.name);
            }
            // Clonable.
            clone() { return this; }
        }
        GameFramework.Traversable = Traversable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
