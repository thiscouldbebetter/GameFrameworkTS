"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class NamableProperty {
            constructor(name) {
                this.name = name;
            }
            static of(entity) {
                return entity.propertyByName(NamableProperty.name);
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return NamableProperty.name; }
            updateForTimerTick(uwpe) { }
            // Equatable.
            equals(other) { return false; }
        }
        GameFramework.NamableProperty = NamableProperty;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
