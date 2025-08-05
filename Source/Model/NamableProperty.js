"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class NamableProperty extends GameFramework.EntityPropertyBase {
            constructor(name) {
                super();
                this.name = name;
            }
            static of(entity) {
                return entity.propertyByName(NamableProperty.name);
            }
            // Clonable.
            clone() { return this; }
        }
        GameFramework.NamableProperty = NamableProperty;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
